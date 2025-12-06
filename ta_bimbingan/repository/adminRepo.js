import { connectDB } from "../db/db.js";

export async function getAllUsers() {
  const pool = await connectDB();
  const query = `SELECT U.email, U.id_users, U.role ,MAX(DTA.semester) as semester FROM data_ta DTA RIGHT JOIN users U on U.id_users = DTA.id_users GROUP BY U.id_users;`;
  const [rows] = await pool.execute(query)
  return rows;
}

