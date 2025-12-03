// routes.js
import express from "express";
import fs from "fs";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { login, logout } from "../controllers/authController.js";
import multer from "multer";

// Import Controller yang sudah dipisah-pisah
import {
    riwayat,
    ajukanBimbingan,
} from "../controllers/bimbinganController.js";
import { checkAvailability } from "../controllers/jadwalController.js";
import { pengajuanInit } from "../controllers/referensiController.js";
import { dashboard, pengajuan } from "../controllers/pageController.js";
import * as jadwalController from "../controllers/jadwalController.js";
import { getJadwalBimbingan } from "../controllers/bimbinganController.js";

// router buat endpoint
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
router.post("/api/login", login);
router.post("/api/logout", logout);

// biar si routernya pake middleware protectRoute
router.use(protectRoute);

router.post("/api/upload-jadwal", upload.single("file_excel"), jadwalController.uploadJadwal);
router.get("/api/riwayat", riwayat);
router.post("/api/ajukan-bimbingan", ajukanBimbingan);
router.get("/api/check-availability", checkAvailability);
router.get("/api/pengajuan-init", pengajuanInit);
router.get("/dashboard", dashboard);
router.get("/pengajuan", pengajuan);
router.get("/api/riwayat", riwayat);
router.get("/api/jadwal-bimbingan", getJadwalBimbingan);


// Route Get Jadwal (untuk ditampilkan di tabel frontend)
router.get("/api/my-schedule",  jadwalController.getMyJadwal);
// router.get("/api/my-schedule", getMyJadwal); // Route baru

export default router;
