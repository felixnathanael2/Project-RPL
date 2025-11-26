import { connectDB } from "../db/db.js";

export async function getDosen(npm) {
  const pool = await connectDB();
  // join mahasiswa dengan dosbing nya, trus diambil siapa aja dosbing nya
  const query = `
          SELECT D.NIK as nik, D.nama, P.status_pembimbing as status
          FROM Plotting_Pembimbing P
          JOIN users D ON D.id_users = P.nik
          WHERE NPM = ?
          ORDER BY status ASC
        `;
  const rows = await pool.execute(query, [npm]);

  return rows[0];
}
