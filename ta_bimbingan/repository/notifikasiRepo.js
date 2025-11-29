import { connectDB } from "../db/db.js";

export async function getNotifikasi(id_users) {
	const pool = await connectDB();

	const [rows] = await pool.execute(
		`SELECT isi, is_read, tanggal_waktu FROM notifikasi WHERE id_users = ? 
		ORDER BY is_read DESC, tanggal_waktu DESC`,
		[id_users],
	);

	return rows;
}

export async function updateNotifikasi(id_users) {
	const pool = await connectDB();

	await pool.execute("UPDATE notifikasi SET is_read = 1 WHERE id = ?", [
		id_users,
	]);
}
