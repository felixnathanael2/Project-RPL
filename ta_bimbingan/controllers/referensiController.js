import { getDosen } from "../services/dosenService.js";
import { getLokasi } from "../services/lokasiService.js";

export const pengajuanInit = async (req, res) => {
  console.log("pengajuanInit dipanggil");
  try {
    const userId = req.user.id;
    console.log(userId);
    const lokasi = await getLokasi();
    console.log("lokasi:", lokasi);
    const dosen = await getDosen(userId);

    console.log("dosen:", dosen);

    // kirim hasilnya ke frontend
    res.json({ lokasi, dosen });
  } catch (e) {
    // statements
    res.status(500).json({ message: "Gagal ambil data" });
  }
};
