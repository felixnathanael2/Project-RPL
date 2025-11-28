import express from "express";
import { protectAPI, protectRoute } from "../middlewares/authMiddleware.js";
import { login, logout } from "../controllers/authController.js";

import {
	riwayat,
	ajukanBimbingan,
} from "../controllers/bimbinganController.js";
import { checkAvailability } from "../controllers/jadwalController.js";
import { pengajuanInit } from "../controllers/referensiController.js";

import {
	dashboard,
	pengajuan,
	notifikasi,
} from "../controllers/pageController.js";

import { showNotifikasi } from "../controllers/notifikasiController.js";

const router = express.Router();

// --- AUTH ---
router.post("/api/login", login);
router.post("/api/logout", logout);

// --- API ROUTES (butuh JSON kalau session habis) ---
router.get("/api/riwayat", protectAPI, riwayat);
router.post("/api/ajukan-bimbingan", protectAPI, ajukanBimbingan);
router.get("/api/check-availability", protectAPI, checkAvailability);
router.get("/api/pengajuan-init", protectAPI, pengajuanInit);
router.get("/api/get-notifikasi", protectAPI, showNotifikasi);

// --- PAGE ROUTES (butuh redirect kalau session habis) ---
router.get("/dashboard", protectRoute, dashboard);
router.get("/pengajuan", protectRoute, pengajuan);
router.get("/notifikasi", protectRoute, notifikasi);

export default router;
