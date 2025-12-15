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
    //ambil data semua dosen
    const query = `SELECT users.nama, users.id_users FROM users WHERE role = 2;`;
    const [rows] = await pool.execute(query);
    return rows;
}

export async function getAllMahasiswaByDosen(nik) {
    const pool = await connectDB();
    //itung mahasiswa yang dibimbing oleh dosen tertentu
    const query =
        "SELECT COUNT(npm) AS total FROM plotting_pembimbing WHERE nik = ?;";
    const [rows] = await pool.execute(query, [nik]);
    return rows[0].total;
}

export async function getAllMahasiswa() {
    const pool = await connectDB();
    //itung semua mahasiswa
    const query = "SELECT COUNT(id_users) AS total FROM users WHERE role = 1;";
    const [rows] = await pool.execute(query);
    return rows[0].total;
}

export async function getAllEligibleSidang() {
    const pool = await connectDB();
    const query =
    //itung semua mahasiswa yang sudah elligible
        "SELECT COUNT(id_users) AS total FROM data_ta WHERE status_eligible = true;";
    const [rows] = await pool.execute(query);
    return rows[0].total;
}

export async function getEligibleSidangByDosen(nik) {
    const pool = await connectDB();
    const query =
    //itung jumlah mahasiswa eligible dosen tertentu
        "SELECT COUNT(PB.npm) AS total FROM data_ta DTA JOIN plotting_pembimbing PB ON DTA.id_users = PB.npm  WHERE status_eligible = true AND PB.nik = ?;";
    const [rows] = await pool.execute(query, [nik]);
    return rows[0].total;
}

export async function getMahasiswaEligible(nik) {
    const pool = await connectDB();

    const query = `
        SELECT users.nama                                       AS nama_mahasiswa,
               users.id_users                                   AS npm,

               CASE
                   WHEN COUNT(DISTINCT dt.id_data) > 1 THEN 3
                   ELSE MAX(dt.jenis_ta) END                    AS jenis_ta_final,

               semester_aktif.tanggal_UTS_selesai,
               semester_aktif.tanggal_UAS_selesai,

               SUM(CASE
                       WHEN bimbingan.tanggal <= semester_aktif.tanggal_UTS_selesai AND bimbingan.status = 'Selesai' THEN 1
                       ELSE 0 END)                              AS total_bimbingan_pre_uts,

               COUNT(CASE WHEN bimbingan.status = 'Selesai' THEN 1 END) AS total_bimbingan_total

        FROM plotting_pembimbing
                 JOIN users ON plotting_pembimbing.npm = users.id_users
                 JOIN data_ta dt ON users.id_users = dt.id_users

                 CROSS JOIN (SELECT tanggal_awal_semester, tanggal_UTS_selesai, tanggal_UAS_selesai
                             FROM rentang_semester
                             ORDER BY id_semester DESC LIMIT 1) semester_aktif

                 LEFT JOIN bimbingan ON dt.id_data = bimbingan.id_data
            AND bimbingan.tanggal BETWEEN semester_aktif.tanggal_awal_semester AND semester_aktif.tanggal_UAS_selesai
            AND bimbingan.status = 'Selesai'

        WHERE plotting_pembimbing.nik = ?
        GROUP BY users.id_users, users.nama, semester_aktif.tanggal_UTS_selesai, semester_aktif.tanggal_UAS_selesai;
    `;

    const [rows] = await pool.execute(query, [nik]);
    return rows;
}

export async function updateStatusEligible(npm, isEligible) {
    const pool = await connectDB();
    //update status eligible setelah bimbingan selesai
    const query = `
    UPDATE data_ta 
    SET status_eligible = ? 
    WHERE id_users = ?
  `;
    await pool.execute(query, [isEligible, npm]);
}