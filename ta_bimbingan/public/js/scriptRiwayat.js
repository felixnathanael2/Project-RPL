document.addEventListener("DOMContentLoaded", function () {
  const selectWrapper = document.querySelector(".custom-select");
  const selectTrigger = document.querySelector(".select-trigger");
  const selectOptions = document.querySelector(".select-options");
  const options = document.querySelectorAll(".option");
  const selectedText = document.getElementById("selectedStudent");

  // Toggle Dropdown
  selectTrigger.addEventListener("click", function (e) {
    e.stopPropagation();
    selectWrapper.classList.toggle("open");
  });

  // Pilih Opsi
  options.forEach((option) => {
    option.addEventListener("click", function () {
      selectedText.textContent = this.textContent;
      options.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");

      const studentID = this.getAttribute("data-value");
      console.log("Mahasiswa terpilih ID:", studentID);

      selectWrapper.classList.remove("open");

      // DISINI NANTI TEMPAT LOAD DATA DARI DATABASE BERDASARKAN ID
      // loadBimbinganByStudent(studentID);
    });
  });

  // Tutup dropdown
  document.addEventListener("click", function (e) {
    if (!selectWrapper.contains(e.target)) {
      selectWrapper.classList.remove("open");
    }
  });
});

// EXTEND
function toggleAccordion(headerElement) {
  // Ambil parent item (.bimbingan-item)
  const item = headerElement.parentElement;
  item.classList.toggle("active");
  y;
}

document.addEventListener("DOMContentLoaded", async function () {
  const bimbinganListContainer = document.querySelector(".bimbingan-list");

  function toggleAccordion(headerElement) {
    const item = headerElement.parentElement;
    item.classList.toggle("active");

    const arrow = headerElement.querySelector(".arrow");
    arrow.style.transform = item.classList.contains("active")
      ? "rotate(180deg)"
      : "rotate(0deg)";
  }

  window.toggleAccordion = toggleAccordion;

  try {
    const response = await fetch("/api/riwayat");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();

    let data = result.data; // asumsikan sudah descending tanggal
    const totalBimbingan = data.length;

    // Kosongkan container dulu
    bimbinganListContainer.innerHTML = "";

    data.forEach((bimbingan, index) => {
      const item = document.createElement("div");
      item.classList.add("bimbingan-item");
      item.setAttribute("data-id", bimbingan.id_bimbingan || index + 1);

      // Nomor bimbingan = dari bawah ke atas
      const bimbinganNumber = totalBimbingan - index;

      item.innerHTML = `
        <div class="bimbingan-header" onclick="toggleAccordion(this)">
          <div class="header-info">
            <h3>Bimbingan ${bimbinganNumber}</h3>
            <span class="date">${new Date(bimbingan.tanggal).toLocaleDateString(
              "id-ID",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}</span>
          </div>
          <i class="ri-arrow-down-s-line arrow"></i>
        </div>
        <div class="bimbingan-body">
          <div class="body-content">
            <div class="info">
              <h3 class="subContent">Tanggal&nbsp;:  ${new Date(
                bimbingan.tanggal
              ).toLocaleDateString("id-ID")}</h3>
            </div>
            <div class="info">
              <h3 class="subContent">Dosen&nbsp;&nbsp;&nbsp;&nbsp;: ${
                bimbingan.nama_dosen || bimbingan.nama
              }</h3>
            </div>
            <div class="info">
              <h3 class="subContent">Jam&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${
                bimbingan.waktu
              }</h3>
            </div>
            <div class="info">
              <h3 class="subContent">Lokasi&nbsp;&nbsp;&nbsp;&nbsp;: ${
                bimbingan.nama_ruangan
              }</h3>
            </div>
            <div class="info">
              <h3 class="subContent">Topik&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${
                bimbingan.catatan_bimbingan
              }</h3>
            </div>
          </div>
        </div>
      `;

      bimbinganListContainer.appendChild(item);
    });
  } catch (err) {
    console.error("Gagal fetch data riwayat:", err);
    bimbinganListContainer.innerHTML = `<p>Gagal memuat data riwayat.</p>`;
  }
});
