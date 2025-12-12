import { connectDB } from "../db/db.js";

export async function getUserById(id) {
  const pool = await connectDB();

  const query = "SELECT * FROM users WHERE id_users = ?";
  const [rows] = await pool.execute(query, [id]);
  return rows[0];
}

export async function getDosenbyMahasiswaId(id) {
  const pool = await connectDB();

  const query = "SELECT nik FROM plotting_pembimbing WHERE npm = ?";
  const [rows] = await pool.execute(query, [id]);

  if (rows.length === 0) {
    return [];
  }

  const nikDosenArray = rows.map((row) => row.nik);

  const placeholders = nikDosenArray.map(() => "?").join(",");
  const queryNama = `SELECT nama FROM users WHERE id_users IN (${placeholders})`;

  const [namaRows] = await pool.execute(queryNama, nikDosenArray);

  const namaDosenList = namaRows.map((row) => row.nama);

  return namaDosenList;
}
