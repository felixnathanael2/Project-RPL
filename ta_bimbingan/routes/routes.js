// routes.js
import express from "express";
import fs from "fs";
import multer from "multer";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { login, logout } from "../controllers/authController.js";

import {
    riwayat,
    ajukanBimbingan,
    getJadwalBimbingan,
} from "../controllers/bimbinganController.js";

import * as jadwalController from "../controllers/jadwalController.js";
import { checkAvailability } from "../controllers/jadwalController.js";
import { pengajuanInit } from "../controllers/referensiController.js";

import {
    dashboard,
    pengajuan,
    notifikasi
} from "../controllers/pageController.js";

import { showNotifikasi } from "../controllers/notifikasiController.js";

const router = express.Router();

// ==========================================
// KONFIGURASI MULTER (UPLOAD EXCEL)
// ==========================================
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

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

router.post("/api/login", login);
router.post("/api/logout", logout);

router.use(protectRoute);

// --- API ROUTES (JSON Data) ---
router.post("/api/upload-jadwal", upload.single("file_excel"), jadwalController.uploadJadwal);
router.get("/api/my-schedule", jadwalController.getMyJadwal);
router.get("/api/check-availability", checkAvailability);

router.get("/api/riwayat", riwayat); 

router.post("/api/ajukan-bimbingan", ajukanBimbingan);
router.get("/api/jadwal-bimbingan", getJadwalBimbingan);
router.get("/api/pengajuan-init", pengajuanInit);
router.get("/api/get-notifikasi", showNotifikasi);


// --- PAGE ROUTES (Render HTML/EJS) ---
router.get("/dashboard", dashboard);
router.get("/pengajuan", pengajuan);
router.get("/notifikasi", notifikasi);

export default router;