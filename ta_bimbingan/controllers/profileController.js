import { getProfile } from "../services/x.js";
import { getDosenPembimbing } from "../services/profileService.js";

const ROLE_MAHASISWA = 1;
// const ROLE_DOSEN = 2;
export const getMyProfileApi = async (req, res) => {
    try {

        const id_users = req.user.id; 
        const userRole = req.user.role;
        
        const userData = await profileService.getProfile(id_users);
        
        if (!userData) {
            return res.status(404).json({ message: "Data pengguna tidak ditemukan." });
        }

        let responseData = {
            ...userData,
            pembimbing: null
        };

        if (userRole === ROLE_MAHASISWA) {
            const dosen = await getDosenPembimbing(id_users);
            
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
        res.status(500).json({ message: "Terjadi kesalahan server saat mengambil data profil." });
    }
};