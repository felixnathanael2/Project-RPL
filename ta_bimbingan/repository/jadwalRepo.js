import { connectDB } from "../db/db.js"

export async function getUnavailableBimbingan(date, nik, npm) {
    const pool = await connectDB();

    // placeholder buat NIK semua dosen (jadi dari array query NIK dosen, nantinya dijadiin "?, ?, ?, ..." buat query)
    const dosenPlaceholders = nik.map(() => '?').join(',');

    // query buat cek tabel bimbingan, kalo udah ada bimbingan di jam tertentu gabisa diajuin lagi
    // sama juga klo dosen nya udh ada bimbingan dengan mahasiswa lain
    // konsep cek nya tuh, diliat si tabel Bimbingan_Dosen itu, diambil semua bimbingan yang melibatkan dosen dan mhs bersangkutan
    const queryBimbingan = `
          SELECT TIME_FORMAT(B.tanggal_Waktu_Bimbingan, '%H:00') as jamTerisi
          FROM Bimbingan B
          LEFT JOIN Bimbingan_Dosen BD ON B.idBimbingan = BD.idBimbingan
          WHERE DATE(B.tanggal_Waktu_Bimbingan) = ? AND B.status != 'Ditolak' 
          AND ((BD.NIK IN (${dosenPlaceholders})) OR B.NPM = ?)
        `;

    // parameter buat ngisi tanda tanya di query tadi, terus di execute aja, hasilnya ambil
    const paramsBimbingan = [date, ...nik, npm];
    const rowsBimbingan = await pool.execute(queryBimbingan, paramsBimbingan);

    return rowsBimbingan[0];
}

export async function getUnavailableJadwal(date, nik, npm) {
    const pool = await connectDB();

    const dosenPlaceholders = nik.map(() => '?').join(',');

    // -----------------------------------------------------------------
    // Sekarang cek jadwal user juga, yang ada matkul matkul atau dosen sibuk
    // ubah dulu tanggal nya jadi hari, misal tgl nov 22 jadi hari sabtu
    const dateObj = new Date(date);
    const namaHari = dateObj.toLocaleDateString('id-ID', { weekday: 'long' });

    const queryJadwal = `
            SELECT Jam_Mulai, Jam_Akhir 
            FROM Jadwal_User 
            WHERE Hari = ? 
            AND (
                NPM = ? OR                   -- Jadwal Kuliah Mahasiswa
                NIK IN (${dosenPlaceholders}) -- Jadwal Mengajar Dosen
            )
        `;

    // parameter buat ngisi ? di query
    const paramsJadwal = [namaHari, npm, ...nik];
    const rowsJadwal = await pool.execute(queryJadwal, paramsJadwal);

    return rowsJadwal[0];
}