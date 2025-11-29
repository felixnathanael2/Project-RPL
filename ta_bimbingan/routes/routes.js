import express from "express";

import fs from "fs";
import { protectAPI, protectRoute } from "../middlewares/authMiddleware.js";
import { login, logout } from "../controllers/authController.js";
import multer from "multer";

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

import { showNotifikasi } from "../controllers/notifikasiController.js";

const router = express.Router();


if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // File disimpan sementara di folder 'uploads/'
    },
    filename: (req, file, cb) => {
        // Beri nama unik: timestamp-namafile
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Filter agar hanya menerima Excel 
const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes("excel") || 
        file.mimetype.includes("spreadsheetml") || 
        file.originalname.match(/\.(xls|xlsx)$/)) {
        cb(null, true);
    } else {
        cb(new Error("Format file harus Excel (.xls / .xlsx)!"), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


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


// Route Get Jadwal (untuk ditampilkan di tabel frontend)
router.get("/api/my-schedule",  protectAPI, jadwalController.getMyJadwal);
// router.get("/api/my-schedule", getMyJadwal); // Route baru

// --- PAGE ROUTES (butuh redirect kalau session habis) ---
router.get("/dashboard", protectRoute, dashboard);
router.get("/pengajuan", protectRoute, pengajuan);
router.get("/notifikasi", protectRoute, notifikasi);

export default router;
