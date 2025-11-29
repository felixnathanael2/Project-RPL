// controllers/jadwalController.js

// 1. TAMBAHKAN IMPORT INI (Ini penyebab utama error 500)
import * as jadwalRepo from "../repository/jadwalRepo.js";

import { getDosen } from "../services/dosenService.js";
import * as jadwalService from "../services/jadwalService.js";

// ==========================================
// Check Availability
// ==========================================
export const checkAvailability = async (req, res) => {
    const { date, pemb } = req.query;

    if (!date || !pemb) return res.json({ availableSlots: [] });

    try {
        const npm = req.user.id;
        let dosenArray = await getDosen(npm);

        if (pemb != 3) dosenArray = dosenArray.filter((d) => d.status === pemb);

        dosenArray = dosenArray.map((d) => d.nik);
        const rangeJam = [
            "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
            "13:00", "14:00", "15:00", "16:00"
        ];

        const sibuk = await jadwalService.getUnavailable(date, dosenArray, req.user.id);
        const jamAvailable = rangeJam.filter((jam) => !sibuk.includes(jam));

        res.json({ jamAvailable });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server Error" });
    }
};

// ==========================================
// Upload Jadwal
// ==========================================
export const uploadJadwal = async (req, res) => {
    try {
        if (!req.file) {
            // Kalau lupa upload file, balikin ke dashboard tapi kasih alert (opsional) 
            // atau tetep json error
            return res.status(400).send('<script>alert("File belum dipilih!"); window.location.href="/dashboard";</script>');
        }

        const id_users = req.user.id;

        // Proses file (Service tetap sama)
        await jadwalService.processJadwalExcel(req.file.path, id_users);

        // --- PERUBAHAN DISINI ---
        // Jangan kirim JSON, tapi perintahkan browser pindah ke dashboard
        res.redirect('/dashboard');

    } catch (error) {
        console.error("Upload Error:", error);
        // Jika error, kembalikan ke dashboard dengan alert error
        res.status(500).send(`<script>alert("Gagal upload: ${error.message}"); window.location.href="/dashboard";</script>`);
    }
};

export const getMyJadwal = async (req, res) => {
    try {
        const id_users = req.user.id; // Ambil ID dari token/session

        // SEKARANG INI AKAN BERHASIL KARENA SUDAH DI-IMPORT DI ATAS
        const data = await jadwalRepo.getJadwalByUser(id_users);

        // Kirim data mentah dari DB ke frontend
        res.json({
            status: "success",
            data: data
        });
    } catch (error) {
        console.error("Error getMyJadwal:", error);
        // Cek terminal VS Code, pasti errornya "ReferenceError: jadwalRepo is not defined"

        res.status(500).json({ message: "Gagal mengambil jadwal kuliah" });
    }
};