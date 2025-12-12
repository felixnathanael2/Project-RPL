import * as dosenRepo from "../repository/dosenRepo.js";

// ini function buat dapetin dosbing maneh siapa aja, berdasarkan npm
export async function getDosen(npm) {
  return await dosenRepo.getDosen(npm);
}

export async function getAllDosen() {
  return await dosenRepo.getAllDosen();
}

export async function getAllMahasiswaByDosen(nik) {
  return await dosenRepo.getAllMahasiswaByDosen(nik);
}

export async function getAllMahasiswa() {
  return await dosenRepo.getAllMahasiswa();
}

export async function getAllEligibleSidang() {
  return await dosenRepo.getAllEligibleSidang();
}

export async function getEligibleSidangByDosen(nik) {
  return await dosenRepo.getEligibleSidangByDosen(nik);
}

export async function getStatistikKelayakan(nik) {
  const dataMahasiswa = await dosenRepo.getMahasiswaEligible(nik);

  if (!dataMahasiswa || dataMahasiswa.length === 0) {
    return "0 / 0";
  }

  const totalMahasiswa = dataMahasiswa.length;
  let totalEligible = 0;

  const today = new Date();

  const tanggalUTS = new Date(dataMahasiswa[0].tanggal_UTS_selesai);
  const isPreUTS = today <= tanggalUTS;

  // Loop setiap mahasiswa untuk cek kelayakan
  dataMahasiswa.forEach((mhs) => {
    // Parsing data dari SQL (jaga-jaga kalau return-nya string)
    const tipe = parseInt(mhs.jenis_ta_final); // 1, 2, atau 3
    const bimbinganPreUTS = parseInt(mhs.total_bimbingan_pre_uts || 0);
    const bimbinganTotal = parseInt(mhs.total_bimbingan_total || 0);

    let isEligible = false;

    if (isPreUTS) {
      if (tipe === 1 && bimbinganPreUTS >= 2) isEligible = true;
      else if (tipe === 2 && bimbinganPreUTS >= 3) isEligible = true;
      else if (tipe === 3 && bimbinganPreUTS >= 4) isEligible = true;
    } else {
      if (tipe === 1 && bimbinganTotal >= 4) isEligible = true;
      else if (tipe === 2 && bimbinganTotal >= 6) isEligible = true;
      else if (tipe === 3 && bimbinganTotal >= 10) isEligible = true;
    }

    if (isEligible) {
      totalEligible++;
    }
  });
  return `${totalEligible} / ${totalMahasiswa}`;
}
