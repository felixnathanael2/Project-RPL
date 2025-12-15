import * as notifikasiRepo from "../repository/notifikasiRepo.js";

export async function getNotifikasi(id_users) {
	//panggil fungsi ambil semua notifikasi user tertentu
	const rows = await notifikasiRepo.getNotifikasi(id_users);
	return rows;
}
