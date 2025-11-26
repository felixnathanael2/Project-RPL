import path from "path";
import { fileURLToPath } from "url";

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

export const pengajuan = () => {
    res.sendFile(path.join(__dirname, "../private/PengajuanBimbingan"));
};
