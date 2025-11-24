import { connectDB } from "../db/db.js";

export async function getDosen(npm) {
    const pool = await connectDB();
    // join mahasiswa dengan dosbing nya, trus diambil siapa aja dosbing nya
    const query = `
          SELECT D.NIK, D.nama_dosen, P.status_pembimbing
          FROM Plotting_Pembimbing P
          JOIN Dosen_Pembimbing D ON D.NIK = P.NIK
          WHERE NPM = ?
          ORDER BY P.status_pembimbing ASC
        `;
    const rows = await pool.execute(query, [npm]);

    return rows[0];
}