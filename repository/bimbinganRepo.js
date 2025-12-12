import { connectDB } from "../db/db.js";

export async function getRiwayatBimbingan(userId, role) {
  const pool = await connectDB();

  // 1. [FIX] Konversi role ke Number agar aman (Jaga-jaga kalau dari session string)
  const userRole = Number(role);
  const ROLE_MAHASISWA = 1;
  const ROLE_DOSEN = 2;
  const ROLE_ADMIN = 3;
  let query = ""; // Inisialisasi string kosong

  if (userRole === ROLE_MAHASISWA) {
    query = `
            SELECT 
                B.id_bimbingan,
                GROUP_CONCAT(U.nama SEPARATOR ', ') AS nama_dosen,
                L.nama_ruangan, 
                B.tanggal, 
                B.waktu, 
                B.catatan_bimbingan, 
                B.status
            FROM bimbingan B
            JOIN bimbingan_dosen BD ON B.id_bimbingan = BD.id_bimbingan
            LEFT JOIN lokasi L ON B.id_lokasi = L.id_lokasi
            JOIN data_ta DTA ON B.id_data = DTA.id_data
            JOIN users U ON BD.nik = U.id_users
            WHERE DTA.id_users = ? 
            GROUP BY B.id_bimbingan, L.nama_ruangan, B.tanggal, B.waktu, B.catatan_bimbingan, B.status
            ORDER BY B.tanggal DESC, B.waktu DESC;
        `;
  } else if (userRole === ROLE_DOSEN) {
    query = `
             SELECT 
                B.id_bimbingan,
                B.tanggal, 
                B.waktu, 
                B.catatan_bimbingan AS catatan, 
                M.nama AS nama_mahasiswa, 
                D.nama AS nama_dosen,
                L.nama_ruangan AS nama_ruangan, 
                B.status
            FROM bimbingan B
            JOIN bimbingan_dosen BD ON B.id_bimbingan = BD.id_bimbingan
            JOIN data_ta DTA ON B.id_data = DTA.id_data
            JOIN users M ON DTA.id_users = M.id_users
            JOIN users D ON BD.nik = D.id_users
            LEFT JOIN lokasi L ON B.id_lokasi = L.id_lokasi
            WHERE BD.nik = ?
            ORDER BY B.tanggal DESC, B.waktu DESC;
        `;
  } else if (userRole === ROLE_ADMIN) {
    query = `
             SELECT 
                B.id_bimbingan,
                B.tanggal, 
                B.waktu, 
                B.catatan_bimbingan AS catatan, 
                M.nama AS nama_mahasiswa, 
                D.nama AS nama_dosen,
                L.nama_ruangan AS nama_ruangan, 
                B.status
            FROM bimbingan B
            JOIN bimbingan_dosen BD ON B.id_bimbingan = BD.id_bimbingan
            JOIN data_ta DTA ON B.id_data = DTA.id_data
            JOIN users M ON DTA.id_users = M.id_users
            JOIN users D ON BD.nik = D.id_users
            LEFT JOIN lokasi L ON B.id_lokasi = L.id_lokasi
            ORDER BY B.tanggal DESC, B.waktu DESC;
        `;
  } else {
    // [FIX] Jika role tidak dikenali, kembalikan array kosong (jangan biarkan query undefined)
    return [];
  }

  // 3. [FIX] Gunakan Destructuring Array [rows]
  // Ini standar mysql2 agar yang diambil datanya saja, bukan metadata fieldnya.
  const [rows] = await pool.execute(query, [userId]);

  return rows;
}

export async function createPengajuan(data) {
  console.log(data);
  let connection;
  try {
    // konek ke db kek sebelum nya
    const pool = await connectDB();
    connection = await pool.getConnection();

    // nah ini tuh baru, jadi misal disini kan ada beberapa query, ini tuh jadi semacam buffer buat hasil query
    // misal ada query yang gagal, maka query yang berhasil ga disimpen ke database (semisal ada bug di kode atau lainnya)
    await connection.beginTransaction();

    const queryDataTA = "SELECT id_data FROM data_ta WHERE id_users = ?";

    const [id_data] = await connection.execute(queryDataTA, [data.npm]);

    // A. Insert Bimbingan
    const queryInsert = `
          INSERT INTO bimbingan (id_data, id_lokasi, tanggal, waktu, catatan_bimbingan, status)
          VALUES (?, ?, ?, ?, '-', 'Menunggu')
        `;

    const queryNotif = `
            INSERT INTO notifikasi (isi, id_users) VALUES (?,?)
        `;

    const res = await connection.execute(queryInsert, [
      id_data[0].id_data,
      data.lokasiId,
      data.tanggal,
      data.waktu,
    ]);

    await connection.execute(queryNotif, [
      `Pengajuan bimbingan berhasil diajukan pada ${data.tanggal} jam ${data.waktu}`,
      data.npm,
    ]);

    const [namaMhsRows] = await connection.execute(
      "SELECT nama from users WHERE id_users = ?",
      [data.npm]
    );

    const namaMhs = namaMhsRows[0].nama;

    // ambil id bimbingan, karena autoincrement jadi bisa ambil dari InsertId
    const newId = res[0].insertId;

    // B. Insert Dosen Peserta, pake id bimbingan nya pake id yang udah diambil tadi
    for (const nik of data.nik) {
      await connection.execute(
        `INSERT INTO bimbingan_dosen (id_bimbingan, nik) VALUES (?, ?)`,
        [newId, nik]
      );

      await connection.execute(queryNotif, [
        `Mahasiswa ${namaMhs} mengajukan bimbingan pada ${data.tanggal} jam ${data.waktu}`,
        nik,
      ]);
    }

    // nah ini commit baru masukin data data tadi ke db
    await connection.commit();

    // masukin juga ke notifikasi, biar dapet notif pokoknya

    return true;
  } catch (err) {
    // kalo ada gagal nah baru rollback
    if (connection) await connection.rollback();
    throw err;
  } finally {
    if (connection) connection.release();
  }
}

export async function getApprovedBimbinganByStudent(id_student) {
  const pool = await connectDB();

  const query = `
        SELECT 
            b.tanggal, 
            b.waktu, 
            -- Menggabungkan nama dosen jika ada 2 pembimbing
            GROUP_CONCAT(u.nama SEPARATOR ', ') as nama_dosen
        FROM bimbingan b
        JOIN data_ta dt ON b.id_data = dt.id_data
        JOIN bimbingan_dosen bd ON b.id_bimbingan = bd.id_bimbingan
        JOIN users u ON bd.nik = u.id_users
        WHERE 
            dt.id_users = ? 
            AND b.status = 'Disetujui'
        GROUP BY b.id_bimbingan
    `;

  const [rows] = await pool.execute(query, [id_student]);
  return rows;
}

export async function updateStatusBimbingan(data) {
  // kalo misal dosen setujui/tolak, berarti nanti ganti status bimbingan jadi disetujui/ditolak,
  // terus masukin notifikasi ke mahasiswa bahwa bimbingan udh disetujui/ditolak

  const pool = await connectDB();
  // data yang dibutuhin: bimbingan mana yang disetujui, npm, nik,
  const { id_bimbingan, nik, button, notes } = data;

  // console.log("BERHASIL MASUK KE REPO UPDATE", data);

  // cari npm
  const queryNPM = `
        SELECT id_users
        FROM data_ta
        WHERE id_data = (SELECT id_data FROM bimbingan WHERE id_bimbingan = ?)
    `;

  const [npmRows] = await pool.execute(queryNPM, [id_bimbingan]);
  const npm = npmRows[0].id_users;

  // cari tanggal bimbingan
  const queryTanggal = `
        SELECT tanggal FROM bimbingan WHERE id_bimbingan = ?
    `;

  const [tanggalRows] = await pool.execute(queryTanggal, [id_bimbingan]);

  const tanggal = tanggalRows[0].tanggal;

  const queryAlter = `
        UPDATE bimbingan_dosen
        SET status = ?
        WHERE id_bimbingan = ? AND nik = ?
    `;

  if (button === 1) {
    await pool.execute(queryAlter, ["Disetujui", id_bimbingan, nik]);
  } else {
    await pool.execute(queryAlter, ["Ditolak", id_bimbingan, nik]);
    await pool.execute(
      `UPDATE bimbingan SET status = ? WHERE id_bimbingan = ?`,
      ["Ditolak", id_bimbingan]
    );
    await pool.execute(`INSERT INTO notifikasi (isi, id_users) VALUES (?, ?)`, [
      `Bimbingan anda untuk tanggal ${tanggal} telah ditolak`,
      npm,
    ]);

    await pool.execute(
      `UPDATE bimbingan SET catatan_bimbingan = ? WHERE id_bimbingan = ?`,
      [notes, id_bimbingan]
    );
    return true;
  }

  const queryNotif = `
        INSERT INTO notifikasi (isi, id_users) VALUES (?, ?)
    `;

  // notif buat dosen
  await pool.execute(queryNotif, [
    `Anda telah menyetujui bimbingan NPM: ${npm} untuk tanggal ${tanggal}`,
    nik,
  ]);

  const queryCek = `
        SELECT status FROM bimbingan_dosen WHERE id_bimbingan = ?
    `;

  const [doneRows] = await pool.execute(queryCek, [id_bimbingan]);

  const allApproved = doneRows.every((row) => row.status === "Disetujui");
  const anyRejected = doneRows.some((row) => row.status === "Ditolak");

  if (allApproved) {
    await pool.execute(
      `UPDATE bimbingan SET status = ? WHERE id_bimbingan = ?`,
      ["Disetujui", id_bimbingan]
    );
    await pool.execute(queryNotif, [
      `Bimbingan anda untuk tanggal ${tanggal} telah disetujui`,
      npm,
    ]);
  }

  return true;
}

export async function getTotalBimbingan() {
  const pool = await connectDB();
  const query =
    "SELECT COUNT(id_bimbingan) AS jumlah_bimbingan FROM bimbingan;";
  const rows = await pool.execute(query);
  return rows[0];
}

export async function getTotalBimbinganByDosen(nik) {
  const pool = await connectDB();
  const query =
    "SELECT COUNT(id_bimbingan) AS jumlah_bimbingan FROM bimbingan_dosen WHERE nik = ?;";
  const rows = await pool.execute(query, [nik]);
  return rows[0];
}

export async function updateCatatanBimbingan(id, notes) {
  const pool = await connectDB();
  const query = `
      UPDATE bimbingan
      SET catatan_bimbingan = ?
      WHERE id_bimbingan = ?;
      `;
  await pool.execute(query, [notes, id]);
  return true;
}

export async function getAllRiwayatBimbingan() {
  const pool = await connectDB();
  const query = `
             SELECT 
                B.tanggal, 
                B.waktu, 
                B.catatan_bimbingan AS catatan, 
                M.nama AS nama_mahasiswa, 
                D.nama AS nama_dosen,
                L.nama_ruangan AS nama_ruangan, 
                B.status
            FROM bimbingan B
            JOIN bimbingan_dosen BD ON B.id_bimbingan = BD.id_bimbingan
            JOIN data_ta DTA ON B.id_data = DTA.id_data
            JOIN users M ON DTA.id_users = M.id_users
            JOIN users D ON BD.nik = D.id_users
            LEFT JOIN lokasi L ON B.id_lokasi = L.id_lokasi
            ORDER BY B.tanggal DESC, B.waktu DESC;
        `;

  const [rows] = await pool.execute(query);
  return rows;
}

// 1. Ambil Tanggal Selesai Semester Aktif
export async function getEndSemesterDate() {
  // Asumsi: Mengambil semester yang sedang berjalan hari ini
  const pool = await connectDB();
  const query = `
    SELECT tanggal_UAS_selesai 
    FROM rentang_semester 
    WHERE CURDATE() BETWEEN tanggal_awal_semester AND tanggal_UAS_selesai
    LIMIT 1
  `;

  const [rows] = await pool.execute(query);

  if (rows.length === 0) {
    // Fallback: Jika tidak ada di DB, return null (nanti di service dilimit manual misal 4 bulan)
    return null;
  }
  return rows[0].tanggal_UAS_selesai; // Return object Date
}

// 2. Insert Banyak (Bulk Transaction)
export async function createBimbinganRutin(listJadwal, dataMhs) {
  // listJadwal: Array of dates ['2024-10-01', '2024-10-08', ...]
  // dataMhs: { npm, id_lokasi, waktu, dosen_id }
  const pool = await connectDB();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction(); // Mulai Transaksi

    // A. Cari ID Data TA Mahasiswa (Cukup sekali query)
    const [mhsRows] = await connection.execute(
      `SELECT id_data FROM data_ta WHERE id_users = ? LIMIT 1`,
      [dataMhs.npm]
    );

    if (mhsRows.length === 0) throw new Error("Mahasiswa belum ambil TA");
    const idData = mhsRows[0].id_data;

    // B. LOOPING INSERT
    // Kita loop setiap tanggal yang sudah digenerate Service
    for (const tanggal of listJadwal) {
      // 1. Insert ke tabel bimbingan
      const [resBim] = await connection.execute(
        `INSERT INTO bimbingan (id_data, id_lokasi, tanggal, waktu, status) 
         VALUES (?, ?, ?, ?, 'Disetujui')`,
        [idData, dataMhs.id_lokasi, tanggal, dataMhs.waktu]
      );

      const newId = resBim.insertId;

      // 2. Insert ke tabel bimbingan_dosen
      await connection.execute(
        `INSERT INTO bimbingan_dosen (id_bimbingan, nik, status, catatan_bimbingan) 
         VALUES (?, ?, 'Disetujui', '-')`,
        [newId, dataMhs.dosen_id]
      );
    }

    await connection.commit(); // Simpan permanen semua jadwal
    return listJadwal.length; // Return berapa banyak jadwal yang dibuat
  } catch (error) {
    await connection.rollback(); // Batalkan SEMUA jika ada 1 error
    throw new Error(error.message);
  } finally {
    connection.release();
  }
}
