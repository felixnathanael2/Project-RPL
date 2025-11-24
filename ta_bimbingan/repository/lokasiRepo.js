import { connectDB } from "../db/db.js"

export async function getLokasi() {
    const pool = await connectDB();

    // Query simpel: Ambil ID dan Nama Ruangan
    // [rows] itu pake array deconstructing, sama aja kek rows[0] da
    const [rows] = await pool.execute('SELECT idLokasi, namaRuangan FROM Lokasi');

    return rows; // Kembalikan array lokasi
}