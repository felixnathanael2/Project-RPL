import * as notifikasiRepo from "../repository/notifikasiRepo.js";

export async function getNotifikasi(id_users) {
  const rows = await notifikasiRepo.getNotifikasi(id_users);
  return rows;
}

export async function markRead(id_users) {
  await notifikasiRepo.setMarkRead(id_users);
}
