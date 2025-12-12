import * as profileRepo from "../repository/profileRepo.js";

export async function getProfile(id_users) {
  const rows = await profileRepo.getUserById(id_users);
  return rows;
}

export async function getDosenPembimbing(id_users) {
  const rows = await profileRepo.getDosenbyMahasiswaId(id_users);
  return rows;
}
