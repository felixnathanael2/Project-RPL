import * as notifikasiRepo from "../repository/notifikasiRepo.js";

export async function getNotifikasi(id_users) {
	const rows = await notifikasiRepo.getNotifikasi();
	return rows;
}
