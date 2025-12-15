// routes.js
import express from "express";
import fs from "fs";
import multer from "multer";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { login, logout } from "../controllers/authController.js";
import * as profileController from "../controllers/profileController.js";

import * as bimbinganController from "../controllers/bimbinganController.js";
import * as dosenController from "../controllers/dosenController.js";
import * as adminController from "../controllers/adminController.js";

import * as mahasiswaController from "../controllers/mahasiswaController.js";
import * as jadwalController from "../controllers/jadwalController.js";
import { pengajuanInit } from "../controllers/referensiController.js";

import * as pageController from "../controllers/pageController.js";
import * as lupapassController from "../controllers/lupapassController.js";
import * as lokasiController from "../controllers/lokasiController.js";
import { showNotifikasi } from "../controllers/notifikasiController.js";

const router = express.Router();

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml") ||
    file.originalname.match(/\.(xls|xlsx)$/)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Format file harus Excel (.xls / .xlsx)!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get("/login", pageController.login);
router.post("/api/login", login);
router.post("/api/logout", logout);

// API lupa password
router.post("/api/lupapass/request", lupapassController.requestOTP);
router.post("/api/lupapass/reset", lupapassController.resetPassword);
router.get("/lupa-password", pageController.lupaPassword);

router.use(protectRoute);

// API ROUTES (JSON Data) 
router.post(
  "/api/upload-jadwal",
  upload.single("file_excel"),
  jadwalController.uploadJadwal
);
router.get("/api/my-schedule", jadwalController.getMyJadwal);
router.get("/api/check-availability", jadwalController.checkAvailability);
router.get("/api/check-availability-dosen", jadwalController.getAvailability);

router.post("/api/ajukan-bimbingan", bimbinganController.ajukanBimbingan);
router.post("/api/submit-bimbingan-rutin", bimbinganController.submitBimbingan);

//dashboard dosen
router.get("/api/riwayat", bimbinganController.riwayat);
router.get("/api/jadwal-bimbingan", bimbinganController.getJadwalBimbingan);
router.get(
  "/api/jadwal-bimbingan-dosen",
  bimbinganController.getJadwalBimbinganDosen
);
router.get(
  "/api/jadwal-bimbingan-today",
  bimbinganController.getJadwalBimbinganToday
);
router.get(
  "/api/dashboard-dosen-stats",
  dosenController.getDashboardDosenStats
);
router.get(
  "/api/dashboard-admin-stats",
  dosenController.getDashboardAdminStats
);

router.get("/api/get-all-dosen", dosenController.getAllDosen);

//dashboard admin
router.get("/api/pengajuan-init", pengajuanInit);
router.get("/api/get-notifikasi", showNotifikasi);
router.get("/api/manajemen-pengguna", adminController.getAllUsers);
router.get("/api/log-data", adminController.getLogData);

//persetujuan
router.get(
  "/api/persetujuan-bimbingan",
  bimbinganController.getPersetujuanBimbingan
);
router.put("/api/update-status-bimbingan", bimbinganController.updateStatus);

router.post("/api/admin/create-user", adminController.createUser);

router.get("/api/get-mahasiswa", mahasiswaController.getMahasiswa);
router.get("/api/bimbingan/:npm", bimbinganController.getRiwayatByNPM);
router.post(
  "/api/bimbingan/update-catatan",
  bimbinganController.updateCatatanBimbingan
);

router.get("/api/get-lokasi", lokasiController.getLokasi);

// buat render html 
router.get("/dashboard", pageController.dashboard);
router.get("/pengajuan", pageController.pengajuan);
router.get("/riwayat", pageController.riwayat);
router.get("/notifikasi", pageController.notifikasi);
router.get("/manajemenPengguna", pageController.manajemenPengguna);
router.get("/debugging", pageController.debugging);
router.get("/addUser", pageController.addUser);
router.get("/addUser/mahasiswa", pageController.addMahasiswa);
router.get("/addUser/dosen", pageController.addDosen);
router.get("/persetujuan", pageController.persetujuan);
router.get("/logAdmin", pageController.logAdmin);
router.get("/riwayatAdmin", pageController.riwayatAdmin);

router.get("/profile", pageController.profile);
router.get("/api/profile", profileController.getMyProfileApi);

export default router;
