import { getNotifikasi } from "../services/notifikasiService.js";

export const getNotifikasi = async (req, res) => {
	try {
		const id_users = req.user.id;

		const data = await getNotifikasi(id_users);

		res.json({
			data: data,
		});
	} catch (e) {
		res.status(500).json({ error: error.message });
	}
};
