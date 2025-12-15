import { connectDB } from "../db/db.js";

export async function getLokasi() {
  const pool = await connectDB();

  const [rows] = await pool.execute(
    "SELECT id_lokasi, nama_ruangan FROM lokasi",
  );

  return rows; 
}
