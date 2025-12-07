import * as mahasiswaRepo from "../repository/mahasiswaRepo.js";

export async function getMahasiswa(nik) {
  const rows = await mahasiswaRepo.getMahasiswa(nik);
  return rows;
}
