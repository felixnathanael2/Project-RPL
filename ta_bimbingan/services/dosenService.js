import * as dosenRepo from "../repository/dosenRepo.js";

// ini function buat dapetin dosbing maneh siapa aja, berdasarkan npm
export async function getDosen(npm) {
    const rows = await dosenRepo.getDosen(npm);
    return rows;
}