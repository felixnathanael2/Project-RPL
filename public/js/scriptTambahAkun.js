function showModal() {
  const popup = document.getElementById("confirmPopup");
  if (popup) popup.classList.add("show");
}

const noBtn = document.getElementById("noBtn");
if (noBtn) {
  noBtn.onclick = function () {
    document.getElementById("confirmPopup").classList.remove("show");
  };
}

const batalBtn = document.getElementById("batalButton");
if (batalBtn) {
  batalBtn.onclick = function () {
    sessionStorage.removeItem("temp_email");
    sessionStorage.removeItem("temp_role");
    window.location.href = "/addUser";
  };
}

function getInputDataMahasiswa(email, roleStr) {
  const namaInput = document.getElementById("nama");
  const npmInput = document.getElementById("npm");
  const semesterInput = document.getElementById("semester");
  const topikInput = document.getElementById("topik");
  const jenisTaInput = document.getElementById("jenis_ta");
  const dosbing1Select = document.getElementById("dosbing1");
  const dosbing2Select = document.getElementById("dosbing2");

  if (!namaInput || !npmInput) return null;

  if (!npmInput.value || !namaInput.value) {
    alert("NPM dan Nama wajib diisi!");
    return null;
  }
  if (dosbing1Select.value === '-' ) {
    alert("Minimah harus ada 1 dosen pembimbing!");
    return null;
  }

  return {
    id_users: npmInput.value,
    email: email,
    nama: namaInput.value,
    password: "pass123",
    role: 1,

    semester: semesterInput ? semesterInput.value : 7,
    topik: topikInput ? topikInput.value : "-",
    jenis_ta: jenisTaInput ? jenisTaInput.value : 1,

    dosen1:
      dosbing1Select && dosbing1Select.value !== "-"
        ? dosbing1Select.value
        : null,
    dosen2:
      dosbing2Select && dosbing2Select.value !== "-"
        ? dosbing2Select.value
        : null,
  };
}

function getInputDataDosen(email, roleStr) {
  const namaInput = document.getElementById("nama");
  const nikInput = document.getElementById("nik");

  if (!namaInput || !nikInput) return null;

  if (!nikInput.value || !namaInput.value) {
    alert("NIK dan Nama wajib diisi!");
    return null;
  }

  return {
    id_users: nikInput.value,
    email: email,
    nama: namaInput.value,
    password: "pass123",
    role: 2,
  };
}

async function sendDataToBackend(inputData) {
  try {
    const response = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputData),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Berhasil menambahkan akun!");
      sessionStorage.clear();
      window.location.href = "/manajemenPengguna";
    } else {
      alert("Gagal: " + (result.message || "Terjadi kesalahan server"));
      const modal = document.getElementById("confirmPopup");
      if (modal) modal.classList.remove("show");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Gagal koneksi ke server.");
  }
}

async function fetchAllDosen() {
  try {
    const dropdownDosen1 = document.querySelector("select#dosbing1");
    if (!dropdownDosen1) return;

    const response = await fetch("/api/get-all-dosen");
    const data = await response.json();

    if (data) {
      dropdownDosen1.innerHTML = "";
      const cover = document.createElement("option");
      cover.disabled = true;
      cover.selected = true;
      cover.value = "-";
      cover.textContent = "Pilih salah satu dosen pembimbing";
      dropdownDosen1.appendChild(cover);

      const dropdownDosen2 = document.querySelector("select#dosbing2");
      dropdownDosen2.innerHTML = "";
      const cover2 = document.createElement("option");
      cover2.selected = true;
      cover2.value = "-";
      cover2.textContent = "Tidak ada";
      dropdownDosen2.appendChild(cover2);

      data.forEach((item) => {
        const nama_dosen = item.nama;
        const nik = item.id_users;

        const anak = document.createElement("option");
        anak.value = nik;
        anak.textContent = nama_dosen;
        dropdownDosen1.appendChild(anak);

        const anakClone = anak.cloneNode(true);
        dropdownDosen2.appendChild(anakClone);
      });
    }
  } catch (error) {
    console.error("Gagal mengambil data dosen:", error);
  }
}

function setupDosenDropdownLogic() {
  const dropdown1 = document.querySelector("#dosbing1");
  const dropdown2 = document.querySelector("#dosbing2");

  if (!dropdown1 || !dropdown2) return;

  function updateOptions() {
    const value1 = dropdown1.value;
    const value2 = dropdown2.value;

    for (const opt of dropdown1.options) opt.disabled = false;
    for (const opt of dropdown2.options) opt.disabled = false;

    if (value2 !== "-") {
      const target = dropdown1.querySelector(`option[value="${value2}"]`);
      if (target) target.disabled = true;
    }
    if (value1 !== "-") {
      const target = dropdown2.querySelector(`option[value="${value1}"]`);
      if (target) target.disabled = true;
    }
  }

  dropdown1.addEventListener("change", updateOptions);
  dropdown2.addEventListener("change", updateOptions);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAllDosen();

  setupDosenDropdownLogic();

  const yesBtn = document.getElementById("yesBtn");

  if (yesBtn) {
    yesBtn.onclick = async function (e) {
      e.preventDefault();

      const email = sessionStorage.getItem("temp_email");
      const roleStr = sessionStorage.getItem("temp_role");

      if (!email || !roleStr) {
        alert("Data sesi hilang. Silakan ulangi dari awal.");
        window.location.href = "/addUser";
        return;
      }

      let inputData = null;

      if (roleStr === "Mahasiswa") {
        inputData = getInputDataMahasiswa(email, roleStr);
      } else if (roleStr === "Dosen") {
        inputData = getInputDataDosen(email, roleStr);
      }

      if (inputData) {
        await sendDataToBackend(inputData);
      } else {
        const modal = document.getElementById("confirmPopup");
        if (modal) modal.classList.remove("show");
      }
    };
  }
});

window.showModal = showModal;
