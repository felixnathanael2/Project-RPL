// controllers/jadwalController.js
import * as jadwalRepo from "../repository/jadwalRepo.js";

import { getDosen } from "../services/dosenService.js";
import * as jadwalService from "../services/jadwalService.js";

export const checkAvailability = async (req, res) => {
  // ambil tanggal dan dosen ybs dari query di browser nya
  // query tuh mksdnya yg kyk ...?date=2025-11-20&pemb=1
  const { date, pemb } = req.query;

  // kalo di front end nya ga di default data ininya, drpd error
  if (!date || !pemb) return res.json({ availableSlots: [] });

  try {
    const npm = req.user.id;
    let dosenArray = await getDosen(npm);

    if (pemb != 3) dosenArray = dosenArray.filter((d) => d.status == pemb);

    dosenArray = dosenArray.map((d) => d.nik);

    // bikin semua kemungkinan slot jam (7-17 (jam kerja))
    const rangeJam = [
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
    ];

    // ambil slot yang udah keiisi (sibuk) dari db
    const sibuk = await jadwalService.getUnavailable(
      date,
      dosenArray,
      req.user.id,
    );

    // di filter buat cari jam berapa aja yang available
    // konsep filter tuh jadi, coba loop dari semua rangeJam, terus masukin jam dengan kondisi => ...
    // kondisinya itu berarti masukin jam, kalo misalnya di sibuk tuh gada jam itu, kalo misal ada jadi gausa dimasukkin
    const jamAvailable = rangeJam.filter((jam) => !sibuk.includes(jam));

    //return si data json nya
    res.json({ jamAvailable });
  } catch (e) {
    // statements
    console.log(e);
  }
};

export const uploadJadwal = async (req, res) => {
  try {
    if (!req.file) {
      // kalo lupa upload file, balikin ke dashboard tapi kasih alert
      return res
        .status(400)
        .send(
          '<script>alert("File belum dipilih!"); window.location.href="/dashboard";</script>',
        );
    }

    const id_users = req.user.id;

    await jadwalService.processJadwalExcel(req.file.path, id_users);
    res.redirect("/dashboard");

    // kalo file salah atau ada eror balikin ke dashboard dan kasi alert
  } catch (error) {
    console.error("Upload Error:", error);
    res
      .status(500)
      .send(
        `<script>alert("Gagal upload: ${error.message}"); window.location.href="/dashboard";</script>`,
      );
  }
};

//buat fetch jadwal dari db dan siap dikirim ke frontend
export const getMyJadwal = async (req, res) => {
  try {
    const id_users = req.user.id;

    const data = await jadwalRepo.getJadwalByUser(id_users);

    // kirim data mentah dari DB ke frontend
    res.json({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.error("Error getMyJadwal:", error);

    res.status(500).json({ message: "Gagal mengambil jadwal kuliah" });
  }
};
