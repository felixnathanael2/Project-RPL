import * as adminService from "../services/adminService.js";

// Kode role untuk setiap jenis pengguna
const ROLE_MAHASISWA = 1;
const ROLE_DOSEN = 2;
const ROLE_ADMIN = 3;

//ini buat di managemen pengguna ngeshow user nya ada siapa aja 
export const getAllUsers = async (req, res) => {
  try {
    // Mengambil data dari DB
    const allUsers = await adminService.getAllUsers();
    const formattedData = allUsers.map((item) => {
      let role = "Mahasiswa";
      if (item.role === ROLE_DOSEN) {
        role = "Dosen";
      } else if (item.role === ROLE_ADMIN) {
        role = "Administrator";
      }

      // Ketika semester null maka tampilan "-"
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

//ini buat masukin data baru mahasiswa atau dosen
export const createUser = async (req, res) => {
  try {
    const inputData = req.body;

    await adminService.createNewUser(inputData);

    res.status(201).json({ message: "User berhasil dibuat" });
  } catch (error) {
    console.error("Create User Error:", error);

    // Error handling untuk user yang sudah terdaftar
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: "ID User atau Email sudah terdaftar!" });
    }
    res.status(500).json({ message: "Gagal membuat user: " + error.message });
  }
};

// Memasukan log data untuk ke tabel log nanti
export const getLogData = async (req, res) => {
  try {
    const rawData = await adminService.getLogData();
    const formattedData = rawData.map((item) => {

      // formatting waktu
      const dateObj = new Date(item.waktu);

      const tanggal = dateObj.getDate(); // 1-31 (ambil 31 Hari)
      const bulan = String(dateObj.getMonth() + 1).padStart(2, "0"); // bulan dibikin format 01 - 12
      const tahun = String(dateObj.getFullYear());

      const jam = String(dateObj.getHours()).padStart(2, "0"); // jam diformat biar rangenya jadi 00-23
      const menit = String(dateObj.getMinutes()).padStart(2, "0"); // menit diformat biar rangenya jadi 00-59

      const waktuString = `${tanggal}/${bulan}/${tahun} : ${jam}.${menit}`;

      return {
        email: item.email,
        aksi: item.aksi,
        waktu: waktuString,
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error("Create User Error:", error);
    res
      .status(500)
      .json({ message: "Gagal memuat log data: " + error.message });
  }
};
