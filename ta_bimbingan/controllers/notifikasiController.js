import {
	getNotifikasi,
	updateNotifikasi,
} from "../services/notifikasiService.js";

export const showNotifikasi = async (req, res) => {
	try {
		const data = await getNotifikasi(req.user.id);

		res.json({
			data: data,
		});
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
};

export const updateNotifikasiRead = async (req, res) => {
	try {
		await updateNotifikasi(req.user.id);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
};
