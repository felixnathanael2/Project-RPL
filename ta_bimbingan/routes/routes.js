// routes.js
import express from "express";
import fs from "fs";
import multer from "multer";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { login, logout } from "../controllers/authController.js";

import * as bimbinganController from "../controllers/bimbinganController.js";
import * as dosenController from "../controllers/dosenController.js";
import * as mahasiswaController from "../controllers/mahasiswaController.js";
import * as jadwalController from "../controllers/jadwalController.js";
import { checkAvailability } from "../controllers/jadwalController.js";
import { pengajuanInit } from "../controllers/referensiController.js";

import * as pageController from "../controllers/pageController.js";

import { showNotifikasi } from "../controllers/notifikasiController.js";

const router = express.Router();

// ==========================================
// KONFIGURASI MULTER (UPLOAD EXCEL)
// ==========================================
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

router.use(protectRoute);

// --- API ROUTES (JSON Data) ---
router.post(
  "/api/upload-jadwal",
  upload.single("file_excel"),
  jadwalController.uploadJadwal
);
router.get("/api/my-schedule", jadwalController.getMyJadwal);
router.get("/api/check-availability", checkAvailability);

router.get("/api/riwayat", bimbinganController.riwayat);
router.post("/api/ajukan-bimbingan", bimbinganController.ajukanBimbingan);
router.get("/api/jadwal-bimbingan", bimbinganController.getJadwalBimbingan);

//dashboard dosen
router.get(
  "/api/jadwal-bimbingan-dosen",
  bimbinganController.getJadwalBimbinganDosen
);
router.get(
  "/api/jadwal-bimbingan-today",
  bimbinganController.getJadwalBimbinganToday
);
router.get("/api/dashboard-dosen-stats", dosenController.getDashboardStats);

router.get("/api/pengajuan-init", pengajuanInit);
router.get("/api/get-notifikasi", showNotifikasi);

router.get("/api/get-mahasiswa", mahasiswaController.getMahasiswa);
router.get("/api/bimbingan/:npm", bimbinganController.getRiwayatByNPM);
router.post(
  "/api/bimbingan/update-catatan",
  bimbinganController.updateCatatanBimbingan
);

// --- PAGE ROUTES (Render HTML/EJS) ---
router.get("/dashboard", pageController.dashboard);
router.get("/pengajuan", pageController.pengajuan);
router.get("/riwayat", pageController.riwayat);
router.get("/notifikasi", pageController.notifikasi);
router.get("/profile", pageController.profile);

export default router;
