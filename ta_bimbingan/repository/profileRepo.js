import { connectDB } from "../db/db.js";

export async function getUserById(id) {
    const pool = await connectDB();

    const query = "SELECT * FROM users WHERE id_users = ?";
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
}

export async function getDosenbyMahasiswaId(id) {
    const pool = await connectDB();

    // 1. Ambil NIK dosen berdasarkan NPM mahasiswa
    const query = "SELECT nik FROM plotting_pembimbing WHERE npm = ?";
    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
        return [];
    }

    // 2. Ambil semua nik sebagai array
    const nikDosenArray = rows.map(row => row.nik);

    // 3. ✅ BANGUN QUERY 'IN' DINAMIS (INI KUNCI UTAMA)
    const placeholders = nikDosenArray.map(() => '?').join(',');
    const queryNama = `SELECT nama FROM users WHERE id_users IN (${placeholders})`;

    const [namaRows] = await pool.execute(queryNama, nikDosenArray);

    // 4. Ambil hanya nama dosen
    const namaDosenList = namaRows.map(row => row.nama);

    return namaDosenList;
}