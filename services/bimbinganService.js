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

// ini buat update catatan bimbingan
export async function updateCatatanBimbingan(id, notes) {
  const success = await bimbinganRepo.updateCatatanBimbingan(id, notes);
  return success;
}
// method buat create pengajuan kalo klik submit
export async function createPengajuan(data) {
  return bimbinganRepo.createPengajuan(data);
}

// method buat ambil total riwayat dari semua dosen dan semua mahasiswa (bnuat di admin)
export async function getAllRiwayatBimbingan() {
  const rows = await bimbinganRepo.getAllRiwayatBimbingan();
  return rows;
}

export async function getApprovedBimbingan(id_student) {
  return bimbinganRepo.getApprovedBimbinganByStudent(id_student);
}

export async function updateStatusBimbingan(data) {
  return bimbinganRepo.updateStatusBimbingan(data);
}

// Helper: Ubah Nama Hari ke Date Object terdekat
const getNextDateObject = (dayName) => {
  const dayMap = {
    Minggu: 0,
    Senin: 1,
    Selasa: 2,
    Rabu: 3,
    Kamis: 4,
    Jumat: 5,
    Sabtu: 6,
  };
  const today = new Date();
  const targetDay = dayMap[dayName];
  const currentDay = today.getDay();

  let daysUntilTarget = targetDay - currentDay;
  if (daysUntilTarget <= 0) daysUntilTarget += 7; // Selalu ambil minggu depan/hari berikutnya

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntilTarget);
  return nextDate; // Return Object Date (bukan string)
};

export async function submitJadwalRutin(payload) {
  // Tentukan Tanggal Mulai (Hari X terdekat)
  let currentDate = getNextDateObject(payload.hari);

  // Tentukan Tanggal Akhir (Dari DB Semester)
  let endDate = await bimbinganRepo.getEndSemesterDate();

  // Jika admin lupa set semester di DB, set manual 4 bulan kedepan
  if (!endDate) {
    endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 4);
  } else {
    endDate = new Date(endDate); // Pastikan jadi object Date
  }

  // GENERATE LIST TANGGAL (Looping +7 hari)
  const listTanggalToInsert = [];

  // Selama tanggal sekarang <= tanggal akhir semester
  while (currentDate <= endDate) {
    // Format ke YYYY-MM-DD string untuk MySQL
    const formattedDate = currentDate.toISOString().split("T")[0];
    listTanggalToInsert.push(formattedDate);

    // Tambah 7 Hari (Minggu depan)
    currentDate.setDate(currentDate.getDate() + 7);
  }

  // Jika ternyata akhir semester sudah lewat/minggu ini, error kan
  if (listTanggalToInsert.length === 0) {
    throw new Error("Semester sudah berakhir, tidak bisa buat jadwal rutin.");
  }

  // Kirim ke Repository untuk Bulk Insert
  const count = await bimbinganRepo.createBimbinganRutin(listTanggalToInsert, {
    npm: payload.npm,
    id_lokasi: payload.id_lokasi,
    waktu: payload.jam_mulai,
    dosen_id: payload.dosen_id,
  });

  return {
    total_dibuat: count,
    rentang: `${listTanggalToInsert[0]} s/d ${
      listTanggalToInsert[listTanggalToInsert.length - 1]
    }`,
  };
}
