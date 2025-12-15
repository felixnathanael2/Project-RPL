import * as dosenRepo from "../repository/dosenRepo.js";

// ini function buat dapetin dosbing npm tertentu
export async function getDosen(npm) {
    return await dosenRepo.getDosen(npm);
}

//fungsi ambil semua dosen
export async function getAllDosen() {
    return await dosenRepo.getAllDosen();
}

//fungsi ambil semua mahasiswa yang dibimbing dosen tertentu
export async function getAllMahasiswaByDosen(nik) {
    return await dosenRepo.getAllMahasiswaByDosen(nik);
}

//fungsi ambil semua mahasiwa
export async function getAllMahasiswa() {
    return await dosenRepo.getAllMahasiswa();
}

//fungsi ambil semua mahasiwa eligible
export async function getAllEligibleSidang() {
    return await dosenRepo.getAllEligibleSidang();
}

//fungsi ambil semua mahasiwa eligible berdasarkan dosen tertentu
export async function getEligibleSidangByDosen(nik) {
    return await dosenRepo.getEligibleSidangByDosen(nik);
}

export async function getStatistikKelayakan(nik) {
    const dataMahasiswa = await dosenRepo.getMahasiswaEligible(nik);

    if (!dataMahasiswa || dataMahasiswa.length === 0) {
        return "0 / 0";
    }

    const totalMahasiswa = dataMahasiswa.length;
    let totalEligible = 0;

    const today = new Date();

    const tanggalUTS = new Date(dataMahasiswa[0].tanggal_UTS_selesai);
    const isPreUTS = today <= tanggalUTS;

    for (const mhs of dataMahasiswa) {
        // Parsing data dari SQL
        const tipe = parseInt(mhs.jenis_ta_final); // 1, 2, atau 3
        const bimbinganPreUTS = parseInt(mhs.total_bimbingan_pre_uts || 0);
        const bimbinganTotal = parseInt(mhs.total_bimbingan_total || 0);

        let isEligible = false;

        if (isPreUTS) {
            if (tipe === 1 && bimbinganPreUTS >= 2) isEligible = true;
            else if (tipe === 2 && bimbinganPreUTS >= 3) isEligible = true;
            else if (tipe === 3 && bimbinganPreUTS >= 4) isEligible = true;
        } else {
            if (tipe === 1 && bimbinganTotal >= 4) isEligible = true;
            else if (tipe === 2 && bimbinganTotal >= 6) isEligible = true;
            else if (tipe === 3 && bimbinganTotal >= 10) isEligible = true;
        }

        // Simpan status true/false ke tabel data_ta
        await dosenRepo.updateStatusEligible(mhs.npm, isEligible);

        if (isEligible) {
            totalEligible++;
        }
    }

    return `${totalEligible} / ${totalMahasiswa}`;
}