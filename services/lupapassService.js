import * as lupapassRepo from "../repository/lupapassRepo.js";

// Minta OTP
export const requestOTPService = async (email) => {
  const user = await lupapassRepo.findUserByEmail(email);
  if (!user) {
    throw new Error("Email tidak terdaftar di sistem.");
  }
  // Generate Token
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  // Simpan ke Database
  await lupapassRepo.saveResetToken(email, token);
  return token;
};

// Reset Password
export const resetPasswordService = async (email, token, newPassword) => {
  // Ambil Token dari Database
  const record = await lupapassRepo.getTokenByEmail(email);
  // Validasi Token
  if (!record) {
    throw new Error("Tidak ada permintaan reset password untuk email ini.");
  }
  if (record.token !== token) {
    throw new Error("Token OTP salah!");
  }
  // Update Password
  await lupapassRepo.updatePassword(email, newPassword);
  await lupapassRepo.deleteToken(email);
  return true;
};
