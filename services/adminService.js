import * as adminRepo from "../repository/adminRepo.js";
import {connectDB} from "../db/db.js";

export async function getAllUsers() {
    return await adminRepo.getAllUsers();
}

export const createNewUser = async (data) => {
    //set default value kalau undefined
    const roleInt = data.role || 1;
    const defaultPassword = "pass123";

    const userData = {
        //data untuk dosen maupun mahasiswa
        id_users: data.id_users,
        email: data.email,
        nama: data.nama,
        password: defaultPassword,
        role: roleInt,

        //data khusus mahasiswa
        semester: data.semester,
        topik: data.topik,
        jenis_ta: data.jenis_ta,
        dosen1: data.dosen1,
        dosen2: data.dosen2,
    };

    return await adminRepo.insertUser(userData);
};

export async function getLogData() {
    return await adminRepo.getLogData();
}

export async function getStatistikKelayakanAdmin() {
    const dataMahasiswa = await adminRepo.getAllMahasiswaEligible();

    // kalo misal ga ada mahasiswa, set dlu aja ke 0/0
    if (!dataMahasiswa || dataMahasiswa.length === 0) {
        return "0 / 0";
    }

    const totalMahasiswa = dataMahasiswa.length;
    let totalEligible = 0;

    // Cek tanggal skrg sama tanggal UTS
    const today = new Date();
    const tanggalUTS = new Date(dataMahasiswa[0].tanggal_UTS_selesai);
    const isPreUTS = today <= tanggalUTS;

    dataMahasiswa.forEach((mhs) => {
        const tipe = parseInt(mhs.jenis_ta_final); // 1 (TA1), 2 (TA2), 3 (2" nya)
        const bimbinganPreUTS = parseInt(mhs.total_bimbingan_pre_uts || 0);
        const bimbinganTotal = parseInt(mhs.total_bimbingan_total || 0);

        let isEligible = false;

        if (isPreUTS) {
            if (tipe === 1 && bimbinganPreUTS >= 2) isEligible = true; // TA1
            else if (tipe === 2 && bimbinganPreUTS >= 3) isEligible = true; // TA2
            else if (tipe === 3 && bimbinganPreUTS >= 4) isEligible = true; // 2" nya

        } else {
            if (tipe === 1 && bimbinganTotal >= 4) isEligible = true; // TA1
            else if (tipe === 2 && bimbinganTotal >= 6) isEligible = true; // TA2
            else if (tipe === 3 && bimbinganTotal >= 10) isEligible = true; // 2" nya
        }

        if (isEligible) {
            totalEligible++;
        }
    });
    return `${totalEligible} / ${totalMahasiswa}`;
}

export async function getAllDosen() {
    return await adminRepo.getAllDosen();
}

export async function getAllMahasiswa() {
    return await adminRepo.getAllMahasiswa();
}