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
}

export async function deleteJadwalByNIK(nik) {
  const pool = await connectDB();
  const query = "DELETE FROM Jadwal_User WHERE NIK = ?";
  await pool.execute(query, nik);
}

export async function deleteJadwalByUser(id_users) {
  const pool = await connectDB();
  const query = "DELETE FROM jadwal_user WHERE id_users = ?";

  await pool.execute(query, [id_users]);
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
}
