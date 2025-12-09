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
      path.join(__dirname, "../private/PengajuanBimbinganDosen.html"),
    );
  } else {
    return res.status(403).json({ message: "Role tidak valid." });
  }
};

export const profile = (req, res) => {
  const role = req.user.role;

  if (role === ROLE_MAHASISWA) {
    res.sendFile(path.join(__dirname, "../private/ProfilePage.html"));
  } else if (role === ROLE_DOSEN) {
    res.sendFile(path.join(__dirname, "../private/ProfilePage.html"));
  } else {
    return res.status(403).json({ message: "Role tidak valid." });
  }
};

export const login = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/page/LoginPage.html"));
};

export const notifikasi = (req, res) => {
  const role = req.user.role;
  if (role === ROLE_MAHASISWA) {
    res.sendFile(path.join(__dirname, "../private/NotificationPage.html"));
  } else if (role === ROLE_DOSEN) {
    res.sendFile(path.join(__dirname, "../private/NotificationPageDosen.html"));
  } else {
    return res.status(403).json({ message: "Role tidak valid." });
  }
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
};

export const manajemenPengguna = (req, res) => {
  const role = req.user.role;
  if (role === ROLE_ADMIN) {
    res.sendFile(path.join(__dirname, "../private/ManajemenPengguna.html"));
  } else {
    return res.status(403).json({ message: "Role tidak valid." });
  }
};

export const addUser = (req, res) => {
  const role = req.user.role;
  if (role === ROLE_ADMIN) {
    res.sendFile(path.join(__dirname, "../private/TambahPenggunaAdmin.html"));
  } else {
    return res.status(403).json({ message: "Role tidak valid." });
  }
};

export const addDosen = (req, res) => {
  const role = req.user.role;
  if (role === ROLE_ADMIN) {
    res.sendFile(
      path.join(__dirname, "../private/TambahPenggunaAdminLanjut_Dosen.html"),
    );
  } else {
    return res.status(403).json({ message: "Role tidak valid." });
  }
};
export const addMahasiswa = (req, res) => {
  const role = req.user.role;
  if (role === ROLE_ADMIN) {
    res.sendFile(
      path.join(
        __dirname,
        "../private/TambahPenggunaAdminLanjut_Mahasiswa.html",
      ),
    );
  } else {
    return res.status(403).json({ message: "Role tidak valid." });
  }
};
export const debugging = (req, res) => {
  res.sendFile(path.join(__dirname, "../private/viewPermintaan.html"));
};

export const persetujuan = (req, res) => {
  const role = req.user.role;

  if (role === ROLE_MAHASISWA) {
    res.sendFile(path.join(__dirname, "../private/viewPermintaan.html"));
  } else if (role === ROLE_DOSEN) {
    res.sendFile(
      path.join(__dirname, "../private/PersetujuanBimbinganDosen.html"),
    );
  } else {
    return res.status(403).json({ message: "Role tidak valid." });
  }
};
export const logAdmin = (req, res) => {
  const role = req.user.role;
  if (role === ROLE_ADMIN) {
    res.sendFile(path.join(__dirname, "../private/logAdmin.html"));
  } else {
    return res.status(403).json({ message: "Role tidak valid." });
  }
};
export const riwayatAdmin = (req, res) => {
  const role = req.user.role;
  if (role === ROLE_ADMIN) {
    res.sendFile(path.join(__dirname, "../private/Riwayat(Admin).html"));
  } else {
    return res.status(403).json({ message: "Role tidak valid." });
  }
};

export const penjadwalan = (req, res) => {
  res.sendFile(path.join(__dirname, "../private/PengajuanBimbinganDosen.html"));
};