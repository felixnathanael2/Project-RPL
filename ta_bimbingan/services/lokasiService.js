import * as lokasiRepo from "../repository/lokasiRepo.js"

export async function getLokasi() {
    const rows = await lokasiRepo.getLokasi();
    return rows;
}