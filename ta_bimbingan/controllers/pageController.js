import path from "path";
import { fileURLToPath } from "url";
import * as jadwalRepo from "../repository/jadwalRepo.js";

// bikin __filename dan __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROLE_MAHASISWA = 1;
const ROLE_DOSEN = 2;
const ROLE_ADMIN = 3;

export const dashboard = (req, res) => {
  const role = req.user.role;

  if (role === ROLE_MAHASISWA) {
    res.sendFile(path.join(__dirname, "../private/DashboardMahasiswa.html"));
  } else if (role === ROLE_DOSEN) {
    res.sendFile(path.join(__dirname, "../private/DashboardDosen.html"));
  } else if (role === ROLE_ADMIN) {
    res.sendFile(path.join(__dirname, "../private/DashboardAdmin.html"));
  } else {
    return res.status(403).json({ message: "Role tidak valid." });
  }
};

export const pengajuan = (req, res) => {
  const role = req.user.role;
  if (role === ROLE_MAHASISWA) {
    res.sendFile(path.join(__dirname, "../private/PengajuanBimbingan.html"));
  } else if (role === ROLE_DOSEN) {
    res.sendFile(
      path.join(__dirname, "../private/PengajuanBimbinganDosen.html")
    );
  } else {
    return res.status(403).json({ message: "Role tidak valid." });
  }
};

<<<<<<< HEAD
export const profile = (req, res) => {
  const role = req.user.role;

  if (role === ROLE_MAHASISWA) {
    res.sendFile(path.join(__dirname, "../private/ProfilePage.html"));
  } else if (role === ROLE_DOSEN) {
    res.sendFile(path.join(__dirname, "../private/ProfilePageDosen.html"));
  } else {
    return res.status(403).json({ message: "Role tidak valid." });
  }
};

export const login = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/page/LoginPage.html"));
};

export const notifikasi = (req, res) => {
  res.sendFile(path.join(__dirname, "../private/NotificationPage.html"));
};

export const riwayat = (req, res) => {
  const role = req.user.role;
  if (role === ROLE_MAHASISWA) {
    res.sendFile(path.join(__dirname, "../private/RiwayatBimbingan.html"));
  } else if (role === ROLE_DOSEN) {
    res.sendFile(path.join(__dirname, "../private/RiwayatBimbinganDosen.html"));
  } else {
    return res.status(403).json({ message: "Role tidak valid." });
  }
=======
export const notifikasi = (req, res) => {
    res.sendFile(path.join(__dirname, "../private/NotificationPage.html"));
>>>>>>> 19f811bb5f83c7ae8dbbd45cad9234ee6266ffef
};
