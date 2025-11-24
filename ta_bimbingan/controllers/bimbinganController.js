import {
    getRiwayatBimbingan,
    createPengajuan
} from "../services/bimbinganService.js";

export const riwayat = async (req, res) => {
    try {
        const riwayat = await getRiwayatBimbingan(req.user.id, req.user.role);
        res.json({
            message: `Riwayat Bimbingan untuk ${req.user.role} (Auth Sesi)`,
            data: riwayat,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const ajukanBimbingan = async (req, res) => {
    try {
        // masukin hasil dari form itu ke variabel, ini sama aja kek manual const tanggal = req.body.tanggal, dst
        const { tanggal, jam, lokasiId, nik } = req.body;

        await createPengajuan({ tanggal, jam, lokasiId, nik, npm: req.user.id });

        res.json({ message: 'Pengajuan berhasil' });
    } catch (e) {
        // statements
        console.log(e);
        res.status(500).json({ message: 'Gagal submit' });
    }
};