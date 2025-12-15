import { getDosenPembimbing } from "../services/profileService.js";
import { getProfile } from "../services/profileService.js";

// Untuk Mahasiswa
const ROLE_MAHASISWA = 1;

export const getMyProfileApi = async (req, res) => {
  try {
    const id_users = req.user.id;
    const userRole = req.user.role;

    const userData = await getProfile(id_users);

    if (!userData) {
      return res
        .status(404)
        .json({ message: "Data pengguna tidak ditemukan." });
    }

    let responseData = {
      ...userData,
      pembimbing: null,
    };

    // Pastikan user adalah mahasiswa, jika ya ambil NPM dan Dosem pembimbing nya
    if (userRole === ROLE_MAHASISWA) {
      const npm = userData.id_users;
      const dosen = await getDosenPembimbing(npm);

      if (dosen && dosen.length > 0) {
        responseData.pembimbing = {
          pembimbing1: dosen[0],
          pembimbing2: dosen[1],
        };
      }
    }

    res.json(responseData);
  } catch (error) {
    console.error("Error API getMyProfileApi:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat mengambil data profil.",
    });
  }
};
