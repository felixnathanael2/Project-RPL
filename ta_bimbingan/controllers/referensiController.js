import { getDosen } from "../services/dosenService.js";
import { getLokasi } from "../services/lokasiService.js";

export const pengajuanInit = async (req, res) => {
    try {
        const userId = req.user.id;
        const lokasi = await getLokasi();
        const dosen = await getDosen(userId);

        // kirim hasilnya ke frontend
        res.json({ lokasi, dosen });
    } catch (e) {
        // statements
        res.status(500).json({ message: 'Gagal ambil data' });
    }
};