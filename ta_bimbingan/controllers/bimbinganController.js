import * as bimbinganService from "../services/bimbinganService.js";

export const riwayat = async (req, res) => {
  try {
    const riwayat = await bimbinganService.getRiwayatBimbingan(
      req.user.id,
      req.user.role
    );
    res.json({
      message: `Riwayat Bimbingan untuk ${req.user.role} (Auth Sesi)`,
      data: riwayat,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update catatan bimbingan berdasarkan id bimbingan
export const updateCatatanBimbingan = async (req, res) => {
  const { id_bimbingan, catatan_bimbingan } = req.body;

  try {
    const update = await bimbinganService.updateCatatanBimbingan(
      id_bimbingan,
      catatan_bimbingan
    );
    res.json({
      message: `Berhasil update catatan untuk bimbingan ${id_bimbingan}}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//mengambil riwayat bimbingan untuk mahasiswa tertentu berdasarkan params
export const getRiwayatByNPM = async (req, res) => {
  const npm = req.params.npm;
  try {
    const riwayat = await bimbinganService.getRiwayatByNPM(npm);

    res.json({
      message: `Riwayat bimbingan untuk mahasiswa dengan NPM: ${npm}`,
      data: riwayat,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const ajukanBimbingan = async (req, res) => {
  try {
    // masukin hasil dari form itu ke variabel, ini sama aja kek manual const tanggal = req.body.tanggal, dst
    const { tanggal, waktu, lokasiId, nik } = req.body;

    await bimbinganService.createPengajuan({
      tanggal,
      waktu,
      lokasiId,
      nik,
      npm: req.user.id,
    });

    res.json({ message: "Pengajuan berhasil" });
  } catch (e) {
    // statements
    console.log(e);
    res.status(500).json({ message: "Gagal submit" });
  }
};

export const getJadwalBimbingan = async (req, res) => {
  try {
    const id_student = req.user.id;
    const data = await bimbinganService.getRiwayatBimbingan(id_student);

    // formatting data biar tanggalnya "YYYY-MM-DD" untuk frontend pake en-CA
    const formattedData = data.map((item) => {
      const dateObj = new Date(item.tanggal);
      const dateStr = dateObj.toLocaleDateString("en-CA");

      return {
        tanggal: dateStr,
        waktu: item.waktu,
        nama_dosen: item.nama_dosen,
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil jadwal bimbingan" });
  }
};

//method helper untuk ambil data dari repository (supaya ga dipanggil berkali kali pakai req dan res,soalnya ntar rencananya filtering data di js bukan di repo)
const fetchJadwalDosen = async (req) => {
  const id_dosen = req.user.id;
  const role = req.user.role;
  const data = await bimbinganService.getRiwayatBimbingan(id_dosen, role);
  return data.map((item) => {
    const t = new Date(item.tanggal);
    const tahun = t.getFullYear();
    const bulan = String(t.getMonth() + 1).padStart(2, "0");
    const hari = String(t.getDate()).padStart(2, "0");

    return {
      tanggal: `${tahun}-${bulan}-${hari}`,
      waktu: item.waktu,
      nama_mahasiswa: item.nama_mahasiswa,
      nama_dosen: item.nama_dosen,
      status: item.status,
      ruangan: item.nama_ruangan,
    };
  });
};

// panggil semua jadwal bimbingan dosen (termasuk history dan upcoming)
export const getJadwalBimbinganDosen = async (req, res) => {
  try {
    const formattedData = await fetchJadwalDosen(req);
    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil jadwal bimbingan dosen" });
  }
};

export const getJadwalBimbinganToday = async (req, res) => {
  try {
    const formattedData = await fetchJadwalDosen(req);
    //tanggal hari ini
    const now = new Date();
    const tahun = now.getFullYear();
    const bulan = String(now.getMonth() + 1).padStart(2, "0");
    const hari = String(now.getDate()).padStart(2, "0");
    const today = `${tahun}-${bulan}-${hari}`;

    //cari yang tanggalnya sesuai dengan hari ini
    const todayBimbingan = formattedData.filter(
      (item) => item.tanggal === today
    );

    res.json(todayBimbingan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menampilkan jadwal hari ini" });
  }
};

//buat SIDEBAR KANAN

export const getTotalPermintaanByDosen = async (req, res) => {
  try {
    const formattedData = await fetchJadwalDosen(req);
    const totalPermintaan = formattedData.filter(
      (item) => item.status === "Menunggu"
    );
    const value = { total_permintaan: totalPermintaan };
    res.json(value);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Gagal mengambil total permintaan by dosen" });
  }
};
export const getTotalBimbinganByDosen = async (req, res) => {
  try {
    const formattedData = await fetchJadwalDosen(req);
    const totalSelesai = formattedData.filter(
      (item) => item.status === "Selesai"
    );
    res.json(totalSelesai.length);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Gagal mengambil total bimbingan by dosen" });
  }
};
