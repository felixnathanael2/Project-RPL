import express from "express";

import fs from "fs";
<<<<<<< HEAD
import multer from "multer";
import { protectRoute } from "../middlewares/authMiddleware.js";
=======
import { protectAPI, protectRoute } from "../middlewares/authMiddleware.js";
>>>>>>> 19f811bb5f83c7ae8dbbd45cad9234ee6266ffef
import { login, logout } from "../controllers/authController.js";

<<<<<<< HEAD
import * as bimbinganController from "../controllers/bimbinganController.js";
import * as dosenController from "../controllers/dosenController.js";
import * as mahasiswaController from "../controllers/mahasiswaController.js";
import * as jadwalController from "../controllers/jadwalController.js";
import { checkAvailability } from "../controllers/jadwalController.js";
import { pengajuanInit } from "../controllers/referensiController.js";

import * as pageController from "../controllers/pageController.js";
=======
import {
    riwayat,
	ajukanBimbingan,
} from "../controllers/bimbinganController.js";
import { checkAvailability } from "../controllers/jadwalController.js";
import { pengajuanInit } from "../controllers/referensiController.js";

import { dashboard, pengajuan } from "../controllers/pageController.js";
import * as jadwalController from "../controllers/jadwalController.js";
import { getJadwalBimbingan } from "../controllers/bimbinganController.js";


import {
	dashboard,
	pengajuan,
	notifikasi,
} from "../controllers/pageController.js";
>>>>>>> 19f811bb5f83c7ae8dbbd45cad9234ee6266ffef

import { showNotifikasi } from "../controllers/notifikasiController.js";

const router = express.Router();

<<<<<<< HEAD
// ==========================================
// KONFIGURASI MULTER (UPLOAD EXCEL)
// ==========================================
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
=======

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
>>>>>>> 19f811bb5f83c7ae8dbbd45cad9234ee6266ffef
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

<<<<<<< HEAD
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
=======

// route for auth
// --- AUTH ---
router.post("/api/login", login);
router.post("/api/logout", logout);

// --- API ROUTES (butuh JSON kalau session habis) ---
router.get("/api/riwayat", protectAPI, riwayat);
router.post("/api/ajukan-bimbingan", protectAPI, ajukanBimbingan);
router.get("/api/check-availability", protectAPI, checkAvailability);
router.get("/api/pengajuan-init", protectAPI, pengajuanInit);
router.get("/api/get-notifikasi", protectAPI, showNotifikasi);


router.post("/api/upload-jadwal", upload.single("file_excel"), protectAPI, jadwalController.uploadJadwal);
router.get("/api/riwayat", protectAPI, riwayat);
router.post("/api/ajukan-bimbingan", protectAPI, ajukanBimbingan);
router.get("/api/check-availability", protectAPI, checkAvailability);
router.get("/api/pengajuan-init", protectAPI, pengajuanInit);
router.get("/dashboard", protectAPI, dashboard);
router.get("/pengajuan", protectAPI, pengajuan);
router.get("/api/riwayat", protectAPI, riwayat);
router.get("/api/jadwal-bimbingan", protectAPI, getJadwalBimbingan);
>>>>>>> 19f811bb5f83c7ae8dbbd45cad9234ee6266ffef

router.get("/api/get-mahasiswa", mahasiswaController.getMahasiswa);
router.get("/api/bimbingan/:npm", bimbinganController.getRiwayatByNPM);
router.post(
  "/api/bimbingan/update-catatan",
  bimbinganController.updateCatatanBimbingan
);

<<<<<<< HEAD
// --- PAGE ROUTES (Render HTML/EJS) ---
router.get("/dashboard", pageController.dashboard);
router.get("/pengajuan", pageController.pengajuan);
router.get("/riwayat", pageController.riwayat);
router.get("/notifikasi", pageController.notifikasi);
router.get("/profile", pageController.profile);
=======
// Route Get Jadwal (untuk ditampilkan di tabel frontend)
router.get("/api/my-schedule",  protectAPI, jadwalController.getMyJadwal);
// router.get("/api/my-schedule", getMyJadwal); // Route baru
>>>>>>> 19f811bb5f83c7ae8dbbd45cad9234ee6266ffef

// --- PAGE ROUTES (butuh redirect kalau session habis) ---
router.get("/dashboard", protectRoute, dashboard);
router.get("/pengajuan", protectRoute, pengajuan);
router.get("/notifikasi", protectRoute, notifikasi);

export default router;
