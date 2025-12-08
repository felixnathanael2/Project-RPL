import * as adminService from "../services/adminService.js";

const ROLE_MAHASISWA = 1;
const ROLE_DOSEN = 2;
const ROLE_ADMIN = 3;

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await adminService.getAllUsers();
    const formattedData = allUsers.map((item) => {
      let role = "Mahasiswa";
      if (item.role === ROLE_DOSEN) {
        role = "Dosen";
      } else if (item.role === ROLE_ADMIN) {
        role = "Administrator";
      }
      const semester = item.semester || "-";

      return {
        email: item.email,
        status: role,
        semester: semester,
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error("Error Manajemen Pengguna: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const inputData = req.body;

    await adminService.createNewUser(inputData);

    res.status(201).json({ message: "User berhasil dibuat" });
  } catch (error) {
    console.error("Create User Error:", error);
    // Cek jika error duplicate entry (kode SQL)
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: "ID User atau Email sudah terdaftar!" });
    }
    res.status(500).json({ message: "Gagal membuat user: " + error.message });
  }
};
