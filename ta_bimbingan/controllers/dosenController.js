import * as dosenService from "../services/dosenService.js";
import * as bimbinganService from "../services/bimbinganService.js"; // Import bimbinganService juga

export const getDashboardStats = async (req, res) => {
  try {
    const nik = req.user.id;
    //total mahasiswa yang dibimbing oleh dosen tsb
    const totalMahasiswa = await dosenService.getAllMahasiswaByDosen(nik);
    //total mahasiswa yang sudah layak sidang (diformat biar jadi kek: layak/total)
    const totalEligible = await dosenService.getEligibleSidangByDosen(nik);
    const strLayakSidang = `${totalEligible} / ${totalMahasiswa}`;
    //total pertemuan bimbingan dengan semua mahasiswa (blm difilter)
    const dataBimbingan = await bimbinganService.getRiwayatBimbingan(
      nik,
      req.user.role,
    );
    // total permintaan bimbingan yang masih menunggu
    const totalPermintaan = dataBimbingan.filter(
      (item) => item.status === "Menunggu",
    ).length;
    // total bimbingan yg udah beres
    const totalBimbingan = dataBimbingan.filter(
      (item) => item.status === "Selesai",
    ).length;

    //balikin dgn format json
    res.json({
      total_mahasiswa: totalMahasiswa,
      layak_sidang: strLayakSidang,
      total_permintaan: totalPermintaan,
      total_bimbingan: totalBimbingan,
    });
  } catch (error) {
    console.error("Error Dashboard Stats:", error);
    res.status(500).json({ error: error.message });
  }
};
