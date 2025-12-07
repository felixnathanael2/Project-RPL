import bcrypt from 'bcrypt';
import * as userRepository from '../repository/userRepo.js';

export const resetPasswordToDefault = async (idUsers) => {
    //Cek apakah user valid (ada)
    const user = await userRepository.findUserById(idUsers);
    if (!user) {
        throw new Error("User tidak ditemukan");
    }

    // password default "123"
    const defaultPassword = "123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Update ke DB
    await userRepository.updatePassword(idUsers, hashedPassword);
    
    return true;
};