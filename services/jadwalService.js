import * as jadwalRepo from "../repository/jadwalRepo.js";
import fs from "fs";
import xlsx from "xlsx"; // Import library xlsx

// cek jam jam yang udah keiisi, biar nanti di dropdown gada jadwal jadwal di jam segini (tergantung tanggal juga )
// dipanggil pas ganti tanggal atau klik pembimbing 2 ikut apa ngga
export async function getUnavailable(date, nik, npm) {
  // console.log("DEBUG PARAMETER:");
  // console.log("Date:", date);
  // console.log("Dosen IDs:", nik);
  // console.log("Student NPM:", npm);
  const rowsBimbingan = await jadwalRepo.getUnavailableBimbingan(
    date,
    nik,
    npm
  );

  // disimpen pake set, biar gada data dobel nanti nya
  let bookedSet = new Set(rowsBimbingan.map((r) => r.jamTerisi));

  const rowsJadwal = await jadwalRepo.getUnavailableJadwal(date, nik, npm);

  // konversi range jam mulai - selesai jadi masing masing per jam, misal 8-10 jadi jam 8 (sampai sembilan) dan 9 (sampai sepuluh)
  for (const jadwal of rowsJadwal) {
    // ambil jam mulai dan selesai, split dulu dari : nya, abis itu ambil si jam nya aj
    let start = parseInt(jadwal.jam_mulai.split(":")[0]);
    let end = parseInt(jadwal.jam_akhir.split(":")[0]);

    // loop jam jam nya, terus masukin ke set tadi
    for (var i = start; i < end; i++) {
      // format ulang (pake :)
      // padStart tuh... padStart(berapa panjangnya, kalo kurang didepannya tambahin pake ini), jadi nti hasilny semua kek format jam
      const jam = i.toString().padStart(2, "0") + ":00";
      bookedSet.add(jam);
    }
  }

  // return si set berisi jam jam yang sibuk dalam bentuk array
  return Array.from(bookedSet);
}

function normalizeDay(day) {
  if (!day) return null;
  const map = {
    senin: "Senin",
    selasa: "Selasa",
    rabu: "Rabu",
    kamis: "Kamis",
    jumat: "Jumat",
    sabtu: "Sabtu",
    minggu: "Minggu",
  };
  return map[day.toString().toLowerCase().trim()] || null;
}

export async function processJadwalExcel(filePath, id_users) {
  try {
    const workbook = xlsx.readFile(filePath);

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // konversi Sheet ke JSON, raw false teh biar nilainya dibaca sbg string
    const rawData = xlsx.utils.sheet_to_json(sheet, { defval: "", raw: false });

    const results = [];

    // mapping Data JSON ke Array Database
    // Format Excel: 'hari', 'jam_mulai', 'jam_akhir'
    for (const row of rawData) {
      // cari key yang mengandung kata 'hari', 'mulai', 'akhir'

      const hariRaw = row["hari"] || row["Hari"];
      const mulaiRaw = row["jam_mulai"] || row["Jam_Mulai"] || row["jam mulai"];
      const akhirRaw = row["jam_akhir"] || row["Jam_Akhir"] || row["jam akhir"];

      const hariValid = normalizeDay(hariRaw);

      if (hariValid && mulaiRaw && akhirRaw) {
        results.push([
          id_users, // ID User
          hariValid, // Hari (Enum)
          mulaiRaw, // Jam Mulai (String '07:00')
          akhirRaw, // Jam Akhir (String '09:00')
        ]);
      }
    }

    // hapus data lama biar tidak ada duplikasi
    await jadwalRepo.deleteJadwalByUser(id_users);

    // Masukkan data baru
    if (results.length > 0) {
      await jadwalRepo.createBulkJadwal(results);
    }

    // hapus file excel biar ga penuh
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return true;
  } catch (error) {
    // Hapus file jika error
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw error;
  }
}


// Fungsi nambah 1 jam untuk label (08:00 -> 09:00)
const addOneHour = (timeStr) => {
  let [hour, minute] = timeStr.split(":").map(Number);
  let newHour = hour + 1;
  return `${newHour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
};

// Fungsi cek apakah targetJam ada di dalam range jadwal sibuk
const isTimeOverlap = (targetJam, start, end) => {
  // Ambil hanya HH:mm (antisipasi format HH:mm:ss dari database)
  const target = targetJam.substring(0, 5);
  const s = start.substring(0, 5);
  const e = end.substring(0, 5);

  // Logic: Target jam dimulainya di antara Start(inklusif) dan End(eksklusif)
  return target >= s && target < e;
};


export async function checkTimeAvailability(dosenId, mahasiswaId, hari) {
  // bikin slot Waktu Bimbingan yang tersedia secara umum
  const allSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  // Ambil data kapan saja Dosen & Mhs SIBUK
  const busySchedules = await jadwalRepo.getBusySlots(
    dosenId,
    mahasiswaId,
    hari
  );

  //  ambil slot yang TIDAK bentrok aja
  const availableSlots = allSlots.filter((slotJam) => {
    // cek apakah slotJam ini overlap dengan salah satu jadwal sibuk
    const isBusy = busySchedules.some((schedule) => {
      return isTimeOverlap(slotJam, schedule.jam_mulai, schedule.jam_akhir);
    });

    return !isBusy; // Return true jika TIDAK sibuk
  });

  // Format data untuk dikirim ke Frontend (Dropdown)
  return availableSlots.map((jam) => ({
    label: `${jam} - ${addOneHour(jam)}`, // Contoh: "08:00 - 09:00"
    value: jam, // Value yang akan disimpan ke DB: "08:00"
  }));
}
