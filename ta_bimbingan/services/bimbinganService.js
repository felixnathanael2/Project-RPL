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

// method buat ambil total riwayat dari semua dosen dan semua mahasiswa (bnuat di admin)
export async function getAllRiwayatBimbingan() {
    const rows = await bimbinganRepo.getAllRiwayatBimbingan();
    return rows;
}


export async function updateStatusBimbingan(data) {
    return bimbinganRepo.updateStatusBimbingan(data);
}