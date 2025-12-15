import { connectDB } from "../db/db.js";

//ambil mahasiswa dengan dosen tertentu
export async function getMahasiswa(nik) {
  const pool = await connectDB();
  const query = `
        SELECT u.id_users, u.nama 
        FROM users u 
        INNER JOIN plotting_pembimbing p ON u.id_users = p.npm 
        WHERE p.nik = ? ORDER BY u.nama ASC`;
  const [rows] = await pool.execute(query, [nik]);
  return rows;
}
