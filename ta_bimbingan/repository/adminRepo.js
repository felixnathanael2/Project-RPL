import { connectDB } from "../db/db.js";

export async function getAllUsers() {
  const pool = await connectDB();
  const query = `SELECT U.email, U.id_users, U.role ,MAX(DTA.semester) as semester FROM data_ta DTA RIGHT JOIN users U on U.id_users = DTA.id_users GROUP BY U.id_users;`;
  const [rows] = await pool.execute(query);
  return rows;
}

export async function insertUser(data) {
  const pool = await connectDB();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    //masukkin records baru di users (mahasiswa maupun dosen)
    const queryUser = `
            INSERT INTO users (id_users, email, nama, password, role)
            VALUES (?, ?, ?, ?, ?)
        `;
    await connection.execute(queryUser, [
      data.id_users,
      data.email,
      data.nama,
      data.password,
      data.role,
    ]);
    //kalau datanya adalah data mahasiswa
    if (data.role === 1) {
      const queryTA = `
                INSERT INTO data_ta (id_users, semester, topik, jenis_ta, status_eligible)
                VALUES (?, ?, ?, ?, ?)
            `;
      await connection.execute(queryTA, [
        data.id_users,
        data.semester || 7, //set defaultnya 7 tapi sebenernya udah ditangani
        data.topik || "-",
        data.jenis_ta || 1,
        false,
      ]);

      if (data.dosen1) {
        const queryPlot1 = `INSERT INTO plotting_pembimbing (npm, nik, status_pembimbing) VALUES (?, ?, ?)`;
        //kalau hanya ada 1 dosen pembimbing saja
        await connection.execute(queryPlot1, [data.id_users, data.dosen1, 1]);
      }
      //kalau ada 2 dosen pembimbing
      if (data.dosen2 && data.dosen2 !== "-") {
        const queryPlot2 = `INSERT INTO plotting_pembimbing (npm, nik, status_pembimbing) VALUES (?, ?, ?)`;
        await connection.execute(queryPlot2, [data.id_users, data.dosen2, 2]);
      }
    }

    const queryLog = `INSERT INTO log_aktivitas (id_users, aksi) VALUES (?, ?)`;
    await connection.execute(queryLog, [
        adminId, 
        `Menambahkan User Baru: ${data.nama} (${data.id_users})`
    ]);

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error; // Lempar error ke service/controller
  } finally {
    connection.release();
  }
}


export async function getLogData() {
  const pool = await connectDB();
  const query = `SELECT U.email, LA.aksi, LA.waktu FROM log_aktivitas LA JOIN users U ON LA.id_users = U.id_users;`;
  const [rows] = await pool.execute(query);
  return rows;
}