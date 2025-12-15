import * as lupapassService from "../services/lupapassService.js";

//req otp 
export const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const token = await lupapassService.requestOTPService(email);
    return res.status(200).json({
      status: "success",
      message: "OTP berhasil dibuat",
      token: token,
    });
  } catch (error) {
    // kalo email ga terdaftar
    if (error.message.includes("Email tidak terdaftar")) {
      return res.status(404).json({ message: error.message });
    }

    console.error("Error Request OTP:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    // validasi input
    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: "Data tidak lengkap!" });
    }
    await lupapassService.resetPasswordService(email, token, newPassword);
    return res.status(200).json({
      status: "success",
      message: "Password berhasil diganti! Silakan login.",
    });
  } catch (error) {
    // kalo token salah/expired
    if (
      error.message.includes("Token") ||
      error.message.includes("permintaan")
    ) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error Reset Password:", error);
    return res.status(500).json({ message: "Gagal mengganti password." });
  }
};
