const modal = document.getElementById("confirmModal");
const form = document.getElementById("submissionForm");

// Membuka Pop-up (Validasi input)
function showModal() {
  const lokasi = document.getElementById("lokasi").value;
  const tanggal = document.getElementById("tanggal").value;
  const waktu = document.getElementById("waktu").value;
  const dosen = document.getElementById("dosen").value;

  if (lokasi && tanggal && waktu && dosen) {
    modal.classList.add("show");
  } else {
    alert("Mohon lengkapi semua data (Lokasi, Dosen, Tanggal, Waktu).");
  }
}

// Tutup Pop-up
function closePopUp() {
  modal.classList.remove("show");
}

window.onclick = function (event) {
  if (event.target == modal) {
    closePopUp();
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
});

// DARI SINI KEBAWAH ITU UNTUK FORM NYA
// ketika windows nya kebuka, ambil data semua lokasi dan dosen
let listDosen = [];
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/pengajuan-init", {
      credentials: "include",
    });
    const data = await res.json();

    // masukkin nama nama ruangan ke list dropdown yang ada
    const locSelect = document.getElementById("lokasi");
    locSelect.innerHTML = "<option>--Pilih Ruangan--</option>";

    console.log("data lokasi:", data.lokasi);
    data.lokasi.forEach((l) => {
      locSelect.innerHTML += `<option value="${l.id_lokasi}">${l.nama_ruangan}</option>`;
    });

    // ngambil data dosen 1 dan dosen 2
    listDosen = data.dosen;

    const pembimbing1 = document.getElementById("dosen1");
    const labelPembimbing1 = document.querySelector(
      'label[for="dosen1"] .label-text',
    );
    const labelPembimbing2 = document.querySelector(
      'label[for="dosen2"] .label-text',
    );
    const pembimbing2 = document.getElementById("dosen2");
    const d1 = listDosen.find((d) => d.status === 1);
    const d2 = listDosen.find((d) => d.status === 2);

    pembimbing1.value = d1.nama;
    labelPembimbing1.textContent = d1.nama;
    if (!d2) {
      pembimbing2.disabled = true;
      labelPembimbing2.textContent = "-";
    } else {
      pembimbing2.value = d2.nama;
      labelPembimbing2.textContent = d2.nama;
    }
  } catch (e) {
    console.log(e);
  }
});

// --- CEK SLOT JAM YANG TERSEDIA BERDASARKAN JADWAL
const tanggalInput = document.getElementById("tanggal");
const jamMulai = document.getElementById("jamStart");
const jamSelesai = document.getElementById("jamEnd");
const statusJam = document.getElementById("statusJam");
async function updateSlots() {
  const date = tanggalInput.value;
  if (!date) return;

  const d1 = listDosen.find((d) => d.status === 1);
  const d2 = listDosen.find((d) => d.status === 2);

  const d2Checked = document.querySelector("#dosen2:checked");
  const ikut2 = d2Checked ? d2Checked.value === "yes" : false;

  let nikList = [];
  if (d1) nikList.push(d1.nik);
  if (ikut2 && d2) nikList.push(d2.nik);

  if (nikList.length === 0) return;

  jamMulai.innerHTML = `<option>Loading...</option>`;
  jamMulai.disabled = true;
  statusJam.textContent = "Mengecek jadwal...";

  const query = `?date=${date}&pemb=${getPembValue()}`;
  const res = await fetch("/api/check-availability" + query, {
    credentials: "include",
  });
  const data = await res.json();

  jamMulai.innerHTML = `<option value="">-- Pilih Jam --</option>`;

  if (data.jamAvailable.length === 0) {
    statusJam.textContent = "Tidak ada slot tersedia.";
    statusJam.style.color = "red";
    return;
  }

  statusJam.textContent = "";
  jamMulai.disabled = false;

  data.jamAvailable.forEach((jam) => {
    jamMulai.innerHTML += `<option value="${jam}">${jam}</option>`;
  });
}

function getPembValue() {
  const d1 = document.getElementById("dosen1");
  const d2 = document.getElementById("dosen2");

  const isD1 = d1.checked;
  const isD2 = d2.checked;

  if (isD1 && isD2) return 3; // kedua pembimbing
  if (isD1) return 1; // pembimbing 1 saja
  if (isD2) return 2; // pembimbing 2 saja

  return 1; // fallback (biar ga error)
}

tanggalInput.addEventListener("change", updateSlots);
document
  .querySelectorAll('input[name="dosen"]')
  .forEach((r) => r.addEventListener("change", updateSlots));

async function submitFinal() {
  // 1. Ambil data dari form HTML
  const tanggalVal = document.getElementById("tanggal").value;
  const waktuVal = document.getElementById("waktu").value; // Format HH:mm
  const lokasiIdVal = document.getElementById("lokasi").value;
  const nikVal = document.getElementById("dosen").value;

  // 2. Siapkan data JSON sesuai req.body di Controller
  const payload = {
    tanggal: tanggalVal,
    waktu: waktuVal,
    lokasiId: lokasiIdVal,
    nik: [nikVal],
  };

  try {
    const response = await fetch("/api/ajukan-bimbingan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Pengajuan berhasil dikirim ke sistem!");
      closePopUp();
      form.reset();
      window.location.href = "/api/riwayat";
    } else {
      alert("Gagal mengajukan: " + (result.message || "Error server"));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Terjadi kesalahan koneksi.");
  }
}
