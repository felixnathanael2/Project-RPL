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
                <h3 style="display:inline-block; width:80px; font-weight:bold;">Tanggal :</h3>
                <span>${new Date(bimbingan.tanggal).toLocaleDateString(
                  "id-ID"
                )}</span>
              </div>
              <div class="info">
                <h3 style="display:inline-block; width:80px; font-weight:bold;">Dosen :</h3>
                <span>${bimbingan.nama_dosen || bimbingan.nama}</span>
              </div>
              <div class="info">
                <h3 style="display:inline-block; width:80px; font-weight:bold;">Jam :</h3>
                <span>${bimbingan.waktu}</span>
              </div>
              <div class="info">
                <h3 style="display:inline-block; width:80px; font-weight:bold;">Lokasi :</h3>
                <span>${bimbingan.nama_ruangan}</span>
              </div>
              <div class="info">
                <h3 style="display:inline-block; width:80px; font-weight:bold;">Catatan :</h3>
                <span>${bimbingan.catatan_bimbingan}</span>
              </div>
              <div class="info">
                <h3 style="display:inline-block; width:80px; font-weight:bold;">Status :</h3>
                <span>${bimbingan.status}</span>
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
