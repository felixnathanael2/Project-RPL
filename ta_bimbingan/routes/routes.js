// routes.js
import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";
import { login, logout } from "../controllers/authController.js";

// Import Controller yang sudah dipisah-pisah
import { riwayat, ajukanBimbingan } from "../controllers/bimbinganController.js";
import { checkAvailability } from "../controllers/jadwalController.js";
import { pengajuanInit } from "../controllers/referensiController.js";

// router buat endpoint
const router = express.Router();

// route for auth
router.post("/login", login);
router.post("/logout", logout);

// biar si routernya pake middleware protectRoute
router.use(protectRoute);

router.get("/riwayat", riwayat);
router.post("/ajukan-bimbingan", ajukanBimbingan);
router.get("/check-availability", checkAvailability);
router.get("/pengajuan-init", pengajuanInit);

export default router;