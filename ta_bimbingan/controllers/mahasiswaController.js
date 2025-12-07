import * as mahasiswaService from "../services/mahasiswaService.js";

export const getMahasiswa = async (req, res) => {
  try {
    const nik = req.user.id;

    const data = await mahasiswaService.getMahasiswa(nik);

    res.json({
      data: data,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
