import * as profileRepo from "../repository/profileRepo.js";

export async function getProfile(id_users) {
  //panggil fungsi ambil info data profil dari profilerepo
  const rows = await profileRepo.getUserById(id_users);
  return rows;
}

export async function getDosenPembimbing(id_users) {
  //panggil fungsi ambil info data dosen pembimbing dari profilerepo
  const rows = await profileRepo.getDosenbyMahasiswaId(id_users);
  return rows;
}
