import * as mahasiswaRepo from "../repository/mahasiswaRepo.js";

export async function getMahasiswa(nik) {
  //panggil fungsi ambil mahasiswa berdasarkan dosen pembimbing
  const rows = await mahasiswaRepo.getMahasiswa(nik);
  return rows;
}
