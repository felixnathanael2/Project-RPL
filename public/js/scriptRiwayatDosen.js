document.addEventListener("DOMContentLoaded", function () {
  const selectWrapper = document.querySelector(".custom-select");
  const selectTrigger = document.querySelector(".select-trigger");

  selectTrigger.addEventListener("click", function (e) {
    e.stopPropagation();
    selectWrapper.classList.toggle("open");
  });

  document.addEventListener("click", function (e) {
    if (!selectWrapper.contains(e.target)) {
      selectWrapper.classList.remove("open");
    }
  });

  loadStudents(); //load semua mahasiswa
});


function toggleAccordion(headerElement) {
  const item = headerElement.parentElement;
  item.classList.toggle("active");
}

async function loadStudents() {
  const selectWrapper = document.querySelector(".custom-select");
  const selectedText = document.getElementById("selectedStudent");
  const selectOptions = document.querySelector(".select-options");

  try {
    const res = await fetch("/api/get-mahasiswa");
    const json = await res.json();
    const students = json.data;

    selectOptions.innerHTML = ""; // Bersihkan dummy/loading

    if (!students || students.length === 0) {
      selectedText.textContent = "Tidak ada mahasiswa";
      return;
    }

    students.forEach((student) => {
      const span = document.createElement("span");
      span.classList.add("option");
      span.setAttribute("data-value", student.id_users);
      span.textContent = `${student.id_users} - ${student.nama}`;

      selectOptions.appendChild(span);

      // Event click saat memilih mahasiswa
      span.addEventListener("click", function () {
        // Update teks trigger
        selectedText.textContent = this.textContent;

        // Update styling active
        document
          .querySelectorAll(".option")
          .forEach((opt) => opt.classList.remove("selected"));
        this.classList.add("selected");

        // Tutup dropdown
        selectWrapper.classList.remove("open");

        // Load bimbingan berdasarkan NPM yang dipilih
        const npm = this.getAttribute("data-value");
        loadBimbinganByStudent(npm);
      });
    });

    // defaultnuya pilih mahasiswa pertama saat load awal
    if (students.length > 0) {
      const first = students[0];
      selectedText.textContent = `${first.id_users} - ${first.nama}`;

      // Set visual selected pada opsi pertama
      const firstOption = selectOptions.querySelector(".option");
      if (firstOption) firstOption.classList.add("selected");

      loadBimbinganByStudent(first.id_users);
    }
  } catch (err) {
    console.error("Gagal load students:", err);
    selectedText.textContent = "Gagal memuat data";
  }
}

async function loadBimbinganByStudent(npm) {
  const container = document.querySelector(".bimbingan-list");
  container.innerHTML =
    "<p style='text-align:center; padding: 20px;'>Memuat data...</p>";

  try {
    const res = await fetch(`/api/bimbingan/${npm}`);
    const json = await res.json();
    const bimbinganList = json.data;

    const totalBimbingan = bimbinganList.length;

    container.innerHTML = ""; 

    if (!bimbinganList || bimbinganList.length === 0) {
      container.innerHTML =
        "<p style='text-align:center; padding: 20px;'>Belum ada riwayat bimbingan.</p>";
      return;
    }

    bimbinganList.forEach((bimbingan, index) => {
      const div = document.createElement("div");
      div.classList.add("bimbingan-item");
      div.dataset.id = bimbingan.id_bimbingan;

      const bimbinganNumber = totalBimbingan - index;

      const tanggal = new Date(bimbingan.tanggal).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Gunakan escape HTML untuk mencegah XSS jika perlu, tapi untuk textarea aman
      const catatanAman = bimbingan.catatan_bimbingan || "";

      div.innerHTML = `
        <div class="bimbingan-header" onclick="toggleAccordion(this)">
          <div class="header-info">
            <h3>Bimbingan ${bimbinganNumber}</h3>
            <span class="date">${tanggal}</span>
          </div>
          <i class="ri-arrow-down-s-line arrow"></i>
        </div>
        <div class="bimbingan-body">
          <div class="body-content">
            <label>Catatan</label>
            <textarea id="note-${
              bimbingan.id_bimbingan
            }" placeholder="Masukkan catatan bimbingan.">${catatanAman}</textarea>
            <div class="action-btn">
              <button class="btn-update" onclick="updateCatatan(${
                bimbingan.id_bimbingan
              })">Update</button>
            </div>
            <div class="status-bimbingan">Status: ${
              bimbingan.status || "-"
            }</div>
            <div class="dosen-info">Pembimbing: ${
              bimbingan.nama_dosen || "-"
            } | Ruangan: ${bimbingan.nama_ruangan || "-"}</div>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Gagal load bimbingan:", err);
    container.innerHTML =
      "<p style='text-align:center; color:red;'>Gagal memuat riwayat bimbingan.</p>";
  }
}

async function updateCatatan(bimbinganID) {
  const noteElement = document.getElementById(`note-${bimbinganID}`);
  const note = noteElement.value; //ambil isi input catatan
  const btn = noteElement.nextElementSibling.querySelector("button");

  const originalText = btn.textContent;
  btn.textContent = "Menyimpan...";
  btn.disabled = true;

  try {
    const res = await fetch(`/api/bimbingan/update-catatan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ // Kirim ID bimbingan dan catatan yang baru di-edit
        id_bimbingan: bimbinganID,
        catatan_bimbingan: note,
      }),
    });

    const result = await res.json();

    if (result.success || res.ok) { //Kalo berhasil
      // Cek res.ok untuk jaga-jaga
      alert("Catatan berhasil diperbarui!");
    } else {
      alert("Gagal update catatan: " + (result.message || "Unknown error"));
    }
  } catch (err) {
    console.error("Error update catatan:", err);
    alert("Terjadi kesalahan koneksi.");
  } finally {
    // Balikin tombol
    btn.textContent = originalText; // Balikin teks tombol ke semula
    btn.disabled = false;
  }
}
