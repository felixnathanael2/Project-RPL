import * as userService from '../services/userService.js';

import * as userRepo from '../repository/userRepo.js';

export const adminResetPassword = async (req, res) => {
    try {
        const { id } = req.params; // Mengambil parameter id dari URL

        await userService.resetPasswordToDefault(id);

        res.status(200).json({
            message: "Password berhasil direset menjadi '123'"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Gagal mereset password",
            error: error.message
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await userRepo.findAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil data user" });
    }
};