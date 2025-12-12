import * as lokasiService from "../services/lokasiService.js";

export const getLokasi = async (req, res) => {
  try {
    const nik = req.user.id;

    const data = await lokasiService.getLokasi();

    res.json({
      data: data,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
