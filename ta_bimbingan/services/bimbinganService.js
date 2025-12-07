import * as bimbinganRepo from "../repository/bimbinganRepo.js";

// export: di export..biar bisa dipake file lain
// async: asynchronus function
export async function getRiwayatBimbingan(userId, role) {
    const rows = await bimbinganRepo.getRiwayatBimbingan(userId, role);
    return rows;
}

// method buat create pengajuan kalo klik submit
export async function createPengajuan(data) {
    return bimbinganRepo.createPengajuan(data);
}

export async function getApprovedBimbingan(id_student) {
    return bimbinganRepo.getApprovedBimbinganByStudent(id_student);
}
