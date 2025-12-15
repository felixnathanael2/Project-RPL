import { getNotifikasi, markRead } from "../services/notifikasiService.js";

export const showNotifikasi = async (req, res) => {
  try {
    const id_users = req.user.id;

    const data = await getNotifikasi(id_users);

    res.json({
      data: data,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const markReadNotifikasi = async (req, res) => {
  try {
    const id_users = req.user.id;

    await markRead(id_users);

    res.json({
      message: `Semua notifikasi dibaca untuk user ${id_users}}`,
    });
  } catch (error) {}
};
