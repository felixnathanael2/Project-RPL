// routes.js
import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { login, logout } from "../controllers/authController.js";

// Import Controller yang sudah dipisah-pisah
import {
	riwayat,
	ajukanBimbingan,
} from "../controllers/bimbinganController.js";
import { checkAvailability } from "../controllers/jadwalController.js";
import { pengajuanInit } from "../controllers/referensiController.js";
import { dashboard, pengajuan } from "../controllers/pageController.js";

// router buat endpoint
const router = express.Router();

// route for auth
router.post("/api/login", login);
router.post("/api/logout", logout);

// biar si routernya pake middleware protectRoute
router.use(protectRoute);

router.get("/api/riwayat", riwayat);
router.post("/api/ajukan-bimbingan", ajukanBimbingan);
router.get("/api/check-availability", checkAvailability);
router.get("/api/pengajuan-init", pengajuanInit);
router.get("/dashboard", dashboard);
router.get("/pengajuan", pengajuan);

export default router;
