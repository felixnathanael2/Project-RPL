import { connectDB } from "../db/db.js";

export async function getUnavailableBimbingan(date, nik, npm) {
  const pool = await connectDB();

  // placeholder buat NIK semua dosen (jadi dari array query NIK dosen, nantinya dijadiin "?, ?, ?, ..." buat query)
  const dosenPlaceholders = nik.map(() => "?").join(",");

  // query buat cek tabel bimbingan, kalo udah ada bimbingan di jam tertentu gabisa diajuin lagi
  // sama juga klo dosen nya udh ada bimbingan dengan mahasiswa lain
  // konsep cek nya tuh, diliat si tabel Bimbingan_Dosen itu, diambil semua bimbingan yang melibatkan dosen dan mhs bersangkutan
  const queryBimbingan = `
          SELECT TIME_FORMAT(B.waktu, '%H:00') as jamTerisi
          FROM bimbingan B
          JOIN bimbingan_dosen BD ON B.id_bimbingan = BD.id_bimbingan
          JOIN data_ta DTA ON B.id_data = DTA.id_data
          WHERE tanggal = ? AND B.status != 'Ditolak' 
          AND ((BD.nik IN (${dosenPlaceholders})) OR DTA.id_users = ?)
        `;

  // parameter buat ngisi tanda tanya di query tadi, terus di execute aja, hasilnya ambil
  const paramsBimbingan = [date, ...nik, npm];
  const rowsBimbingan = await pool.execute(queryBimbingan, paramsBimbingan);

  return rowsBimbingan[0];
}

export async function getUnavailableJadwal(date, nik, npm) {
  const pool = await connectDB();

  const dosenPlaceholders = nik.map(() => "?").join(",");

  // -----------------------------------------------------------------
  // Sekarang cek jadwal user juga, yang ada matkul matkul atau dosen sibuk
  // ubah dulu tanggal nya jadi hari, misal tgl nov 22 jadi hari sabtu
  const dateObj = new Date(date);
  const namaHari = dateObj.toLocaleDateString("id-ID", { weekday: "long" });

  const queryJadwal = `
            SELECT jam_mulai, jam_akhir 
            FROM jadwal_user 
            WHERE hari = ? 
            AND (
                id_users = ? OR                   -- Jadwal Kuliah Mahasiswa
                id_users IN (${dosenPlaceholders}) -- Jadwal Mengajar Dosen
            )
        `;

  // parameter buat ngisi ? di query
  const paramsJadwal = [namaHari, npm, ...nik];
  const rowsJadwal = await pool.execute(queryJadwal, paramsJadwal);

  return rowsJadwal[0];
}

export async function deleteJadwalByNPM(npm) {
  const pool = await connectDB();
  const query = "DELETE FROM Jadwal_User WHERE NPM = ?";
  await pool.execute(query, npm);
  const queryLog = `INSERT INTO log_aktivitas (id_users, aksi) VALUES (?, ?)`;
  await pool.execute(queryLog, [npm, "DELETE JADWAL"]);
}

export async function deleteJadwalByNIK(nik) {
  const pool = await connectDB();
  const query = "DELETE FROM Jadwal_User WHERE NIK = ?";
  await pool.execute(query, nik);
  const queryLog = `INSERT INTO log_aktivitas (id_users, aksi) VALUES (?, ?)`;
  await pool.execute(queryLog, [nik, "DELETE JADWAL"]);
}

export async function deleteJadwalByUser(id_users) {
  const pool = await connectDB();
  const query = "DELETE FROM jadwal_user WHERE id_users = ?";

  await pool.execute(query, [id_users]);
  const queryLog = `INSERT INTO log_aktivitas (id_users, aksi) VALUES (?, ?)`;
  await pool.execute(queryLog, [id_users, "DELETE JADWAL"]);
}

// data - [hari, jam_mulai, jam_akhir_, npm]
export async function uploadJadwalMahasiswa(data) {
  const query = "INSERT INTO Jadwal_User (Jam_Mulai, Jam_Akhir, Hari, NPM)";
}

export async function getJadwalByUser(id_users) {
  const pool = await connectDB();
  const query = "SELECT * FROM jadwal_user WHERE id_users = ?";
  const [rows] = await pool.execute(query, [id_users]);
  return rows;
}

export async function createBulkJadwal(jadwalList) {
  if (jadwalList.length === 0) return;

  const pool = await connectDB();

  const query = `
        INSERT INTO jadwal_user (id_users, hari, jam_mulai, jam_akhir) 
        VALUES ?
    `;

  await pool.query(query, [jadwalList]);

  const queryLog = `INSERT INTO log_aktivitas (id_users, aksi) VALUES (?, ?)`;
  await pool.execute(queryLog, [id_users, "UPLOAD JADWAL"]);
}

export async function getBusySlots(dosenId, mahasiswaId, hari) {
  const pool = await connectDB();
  const query = `
    -- 1. Cek Jadwal Rutin (Kuliah/Dosen) dari tabel jadwal_user
    SELECT jam_mulai, jam_akhir, 'Jadwal Rutin' as keterangan 
    FROM jadwal_user 
    WHERE hari = ? 
    AND (id_users = ? OR id_users = ?)

    UNION ALL

    -- 2. Cek Jadwal Bimbingan yang sudah ada (status Menunggu/Disetujui)
    -- Asumsi: Kita cek bimbingan di hari yang sama (berdasarkan nama hari)
    SELECT b.waktu as jam_mulai, ADDTIME(b.waktu, '01:00:00') as jam_akhir, 'Bimbingan Lain' as keterangan
    FROM bimbingan b
    JOIN bimbingan_dosen bd ON b.id_bimbingan = bd.id_bimbingan
    JOIN data_ta dt ON b.id_data = dt.id_data
    WHERE DATE_FORMAT(b.tanggal, '%W') = ? -- Cek Hari (Pastikan locale DB sesuai atau konversi input)
    AND (
        dt.id_users = ? -- Cek bentrok Mahasiswa
        OR 
        bd.nik = ?      -- Cek bentrok Dosen
    )
    AND b.status IN ('Menunggu', 'Disetujui');
  `;

  // Mapping Hari Indonesia ke Inggris (Jika settingan MySQL kamu bahasa Inggris)
  // Kalau MySQL kamu sudah support 'Senin', mapping ini bisa dihapus/disesuaikan.
  const dayMapping = {
    Senin: "Monday",
    Selasa: "Tuesday",
    Rabu: "Wednesday",
    Kamis: "Thursday",
    Jumat: "Friday",
    Sabtu: "Saturday",
  };

  const hariEnglish = dayMapping[hari] || hari;

  // Parameter urutan: [hari, dosenId, mhsId, hariEnglish, mhsId, dosenId]
  const params = [
    hari,
    dosenId,
    mahasiswaId,
    hariEnglish,
    mahasiswaId,
    dosenId,
  ];

  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    throw new Error("Database Error (getBusySlots): " + error.message);
  }
}
