import * as bimbinganRepo from "../repository/bimbinganRepo.js";

// export: di export..biar bisa dipake file lain
// async: asynchronus function
export async function getRiwayatBimbingan(userId, role) {
  const rows = await bimbinganRepo.getRiwayatBimbingan(userId, role);
  return rows;
}

// pake aja sama kek ngambil bimbingan utk mahasiswa tertentu, kan udh ad npm nya tinggal pake
export async function getRiwayatByNPM(npm) {
  const rows = await bimbinganRepo.getRiwayatBimbingan(npm, 1);
  return rows;
}

// method buat create pengajuan kalo klik submit
export async function createPengajuan(data) {
  return bimbinganRepo.createPengajuan(data);
}

export async function getApprovedBimbingan(id_student) {
  return bimbinganRepo.getApprovedBimbinganByStudent(id_student);
}
