import * as lokasiRepo from "../repository/lokasiRepo.js"

export async function getLokasi() {
    //cuma panggil fungsi repo ambil semua lokasi
    const rows = await lokasiRepo.getLokasi();
    return rows;
}