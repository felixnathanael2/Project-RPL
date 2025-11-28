import { connectDB } from "../db/db.js";

export async function getNotifikasi(id_users) {
	const pool = await connectDB();

	const [rows] = await pool.execute(
		"SELECT isi, is_read, tanggal_waktu FROM notifikasi WHERE id_users = ?",
		[id_users],
	);

	return rows;
}
