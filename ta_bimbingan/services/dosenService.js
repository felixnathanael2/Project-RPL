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