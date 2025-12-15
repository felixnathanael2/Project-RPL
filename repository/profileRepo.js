import { connectDB } from "../db/db.js";

export async function getUserById(id) {
  const pool = await connectDB();
  //ambil user berdasarkan id tertentu
  const query = "SELECT * FROM users WHERE id_users = ?";
  const [rows] = await pool.execute(query, [id]);
  return rows[0];
}

export async function getDosenbyMahasiswaId(id) {
  const pool = await connectDB();
  //ambil nik dosen dari id mahasiswa tertentu
  const query = "SELECT nik FROM plotting_pembimbing WHERE npm = ?";
  const [rows] = await pool.execute(query, [id]);

  if (rows.length === 0) {
    return [];
  }

  //ambil nik dosen, taro di array
  const nikDosenArray = rows.map((row) => row.nik);

  //isi placeholders bakal jadi (?, ?)
  const placeholders = nikDosenArray.map(() => "?").join(",");

  const queryNama = `SELECT nama FROM users WHERE id_users IN (${placeholders})`;

  const [namaRows] = await pool.execute(queryNama, nikDosenArray);

  //jadiin list
  const namaDosenList = namaRows.map((row) => row.nama);

  //ini return list nama dosen, soalnya tiap mahasiswa bisa punya > 1 pembimbing
  return namaDosenList;
}
