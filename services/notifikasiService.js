import * as notifikasiRepo from "../repository/notifikasiRepo.js";

export async function getNotifikasi(id_users) {
  //panggil fungsi ambil semua notifikasi user tertentu
  const rows = await notifikasiRepo.getNotifikasi(id_users);
  return rows;
}

export async function markRead(id_users) {
  await notifikasiRepo.setMarkRead(id_users);
}
