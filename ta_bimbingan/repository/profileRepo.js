import { connectDB } from "../db/db.js";

export async function getUserById(id) {
    const pool = await connectDB();

    const query = "SELECT * FROM users WHERE id = ?"; 
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
}

export async function getDosenbyMahasiswaId(id) {
    const pool = await connectDB();

    const query = "SELECT nik from plotting_pembimbing where npm = ?"; 
    const [rows] = await pool.execute(query, [id]);
    return rows;
}
