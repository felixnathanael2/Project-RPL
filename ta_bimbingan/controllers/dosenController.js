import * as dosenService from "../services/dosenService.js";
import * as bimbinganService from "../services/bimbinganService.js";


export const getDashboardDosenStats = async (req, res) => {
    try {
        const nik = req.user.id;
        //total mahasiswa yang dibimbing oleh dosen tsb
        const totalMahasiswa = await dosenService.getAllMahasiswaByDosen(nik);
        //total mahasiswa yang sudah layak sidang (diformat biar jadi kek: layak/total)
        const totalEligible = await dosenService.getEligibleSidangByDosen(nik);
        const strLayakSidang = `${totalEligible} / ${totalMahasiswa}`;
        //total pertemuan bimbingan dengan semua mahasiswa (blm difilter)
        const dataBimbingan = await bimbinganService.getRiwayatBimbingan(nik, req.user.role);
        // total permintaan bimbingan yang masih menunggu
        const totalPermintaan = dataBimbingan.filter(item => item.status === 'Menunggu').length;
        // total bimbingan yg udah beres
        const totalBimbingan = dataBimbingan.filter(item => item.status === 'Selesai').length;

        //balikin dgn format json
        res.json({
            total_mahasiswa: totalMahasiswa,
            layak_sidang: strLayakSidang,
            total_permintaan: totalPermintaan,
            total_bimbingan: totalBimbingan
        });

    } catch (error) {
        console.error("Error Dashboard Stats:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getDashboardAdminStats = async (req, res) => {
    try {
        const totalDosen = await dosenService.getAllDosen();
        //total mahasiswa yang dibimbing oleh dosen tsb
        const totalMahasiswa = await dosenService.getAllMahasiswa();
        //total mahasiswa yang sudah layak sidang (diformat biar jadi kek: layak/total)
        const totalEligible = await dosenService.getAllEligibleSidang();
        const strLayakSidang = `${totalEligible} / ${totalMahasiswa}`;
        //total pertemuan bimbingan dengan semua mahasiswa (blm difilter)
        const dataBimbingan = await bimbinganService.getAllRiwayatBimbingan();
        // total permintaan bimbingan yang masih menunggu
        const totalPermintaan = dataBimbingan.filter(item => item.status === 'Menunggu').length;
        // total bimbingan yg udah beres
        const totalBimbingan = dataBimbingan.filter(item => item.status === 'Selesai').length;
        
        //balikin dgn format json
        res.json({
            dosen: totalDosen,
            total_dosen: totalDosen.length,
            total_mahasiswa: totalMahasiswa,
            layak_sidang: strLayakSidang,
            total_permintaan: totalPermintaan,
            total_bimbingan: totalBimbingan
        });
        
    } catch (error) {
        console.error("Error Dashboard Stats:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getAllDosen = async (req, res) => {
    const totalDosen = await dosenService.getAllDosen();
    res.json(totalDosen);
    
}
