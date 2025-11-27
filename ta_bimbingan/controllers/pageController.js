import path from "path";
import { fileURLToPath } from "url";
import * as jadwalRepo from "../repository/jadwalRepo.js"

// bikin __filename dan __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dashboard = (req, res) => {
    const role = req.user.role;

    if (role === 1) {
        res.sendFile(
            path.join(__dirname, "../private/DashboardMahasiswa.html"),
        );
    } else if (role === 2) {
        res.sendFile(path.join(__dirname, "../private/DashboardDosen.html"));
    } else if (role === 3) {
        res.sendFile(path.join(__dirname, "../private/DashboardAdmin.html"));
    } else {
        return res.status(403).json({ message: "Role tidak valid." });
    }
};

// UNTUK DEBUGGING
// export const dashboard = async (req, res) => {
//     try {
//         const id_users = req.user.id; // atau req.user.id_users

//         // Asumsi kamu punya fungsi getJadwal
//         const jadwalSaya = await jadwalRepo.getJadwalByUser(id_users);

//         // --- DEBUGGING ---
//         console.log("=== DEBUG DASHBOARD ===");
//         console.log("ID User:", id_users);
//         console.log("Data Jadwal dari DB:", jadwalSaya);
//         // ------------------

//         res.render('dashboard', {
//             user: req.user,
//             jadwal: jadwalSaya
//         });
//     } catch (error) {
//         console.log(error);
//     }

//     res.sendFile(path.join(__dirname, "../private/DashboardMahasiswa.html"));
// }

export const pengajuan = (req, res) => {
    res.sendFile(path.join(__dirname, "../private/PengajuanBimbingan.html"));
};


