import { connectDB } from "../db/db.js";

export async function getDosen(npm) {
  const pool = await connectDB();
  // join mahasiswa dengan dosbing nya, trus diambil siapa aja dosbing nya
  const query = `
          SELECT D.id_users as nik, D.nama, P.status_pembimbing as status
          FROM plotting_pembimbing P
          JOIN users D ON D.id_users = P.nik
          WHERE npm = ?
          ORDER BY status ASC
        `;
  const rows = await pool.execute(query, [npm]);

  return rows[0];
}

export async function getAllDosen() {
  const pool = await connectDB();
  const query = `SELECT users.nama, users.id_users FROM users WHERE role = 2;`;
  const [rows] = await pool.execute(query)
  return rows;
}

export async function getAllMahasiswaByDosen(nik) {
  const pool = await connectDB();
  const query =
    "SELECT COUNT(npm) AS total FROM plotting_pembimbing WHERE nik = ?;";
  const [rows] = await pool.execute(query, [nik]);
  return rows[0].total;
}

export async function getAllMahasiswa() {
  const pool = await connectDB();
  const query = "SELECT COUNT(id_users) AS total FROM users WHERE role = 2;";
  const [rows] = await pool.execute(query);
  return rows[0].total;
}

export async function getAllEligibleSidang() {
  const pool = await connectDB();
  const query =
    "SELECT COUNT(id_users) AS total FROM data_ta WHERE status_eligible = true;";
  const [rows] = await pool.execute(query);
  return rows[0].total;
}

export async function getEligibleSidangByDosen(nik) {
  const pool = await connectDB();
  const query =
    "SELECT COUNT(PB.npm) AS total FROM data_ta DTA JOIN plotting_pembimbing PB ON DTA.id_users = PB.npm  WHERE status_eligible = true AND PB.nik = ?;";
  const [rows] = await pool.execute(query, [nik]);
  return rows[0].total;
}
