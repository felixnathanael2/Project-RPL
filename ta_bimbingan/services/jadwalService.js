import * as jadwalRepo from "../repository/jadwalRepo.js";

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
        npm,
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
