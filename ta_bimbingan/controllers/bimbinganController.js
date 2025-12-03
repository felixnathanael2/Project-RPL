import {
    getRiwayatBimbingan,
    createPengajuan,
    getApprovedBimbingan
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
        const { tanggal, waktu, lokasiId, nik } = req.body;

        await createPengajuan({
            tanggal,
            waktu,
            lokasiId,
            nik,
            npm: req.user.id,
        });

        res.json({ message: "Pengajuan berhasil" });
    } catch (e) {
        // statements
        console.log(e);
        res.status(500).json({ message: "Gagal submit" });
    }
};

export const getJadwalBimbingan = async (req, res) => {
    try {
        const id_student = req.user.id; 
        
        const data = await getApprovedBimbingan(id_student);

        // formatting data biar tanggalnya "YYYY-MM-DD" untuk frontend pake en-CA
        const formattedData = data.map(item => {
            const dateObj = new Date(item.tanggal);
            const dateStr = dateObj.toLocaleDateString('en-CA'); 
            
            return {
                tanggal: dateStr,
                waktu: item.waktu, 
                nama_dosen: item.nama_dosen
            };
        });

        res.json(formattedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil jadwal bimbingan" });
    }
};
