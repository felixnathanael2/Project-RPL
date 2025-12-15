// Variabel global untuk nyimpen data agar bisa didownload
let historyData = [];

async function fetchRiwayatAdmin() {
  try {
    const response = await fetch("/api/riwayat");

    if (!response.ok) throw new Error("Gagal mengambil data riwayat");

    const result = await response.json();

    historyData = result.data || [];

    renderHistory(historyData);
  } catch (error) {
    console.error("Error:", error);
    document.querySelector(
      ".notificationContainer"
    ).innerHTML = `<p style="text-align:center; color:red; padding:2rem;">Gagal memuat data: ${error.message}</p>`;
  }
}

function renderHistory(data) {
  const container = document.querySelector(".notificationContainer");
  container.innerHTML = ""; // bersihkan data lama

  if (!data || data.length === 0) {
    container.innerHTML =
      '<p style="text-align:center; padding:2rem;">Belum ada riwayat bimbingan.</p>';
    return;
  }

  data.forEach((item) => {
    //format tanggal agar rapi
    const dateObj = new Date(item.tanggal);
    const dateStr = dateObj.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const timeStr = item.waktu ? item.waktu.substring(0, 5) : "-";

    let statusColor = "black";
    if (item.status === "Disetujui" || item.status === "Selesai")
      statusColor = "green";
    else if (item.status === "Ditolak") statusColor = "red";
    else if (item.status === "Menunggu") statusColor = "#d97706"; // Orange

    const card = document.createElement("div");
    card.className = "formTitle subTitle";

    card.innerHTML = `
            <div class="glass-box isiHistory">
                <h2 class="textContent">${
                  item.nama_mahasiswa || "Mahasiswa"
                }</h2>
                
                <div class="info">
                    <h3 class="subContent">Tanggal</h3>
                    <p class="dotSpacing">:</p>
                    <h3 class="subContent">${dateStr}</h3>
                </div>
                
                <div class="info">
                    <h3 class="subContent">Dosen</h3>
                    <p class="dotSpacing">:</p>
                    <h3 class="subContent">${item.nama_dosen || "-"}</h3>
                </div>

                <div class="info">
                    <h3 class="subContent">Jam</h3>
                    <p class="dotSpacing">:</p>
                    <h3 class="subContent">${timeStr}</h3>
                </div>

                <div class="info">
                    <h3 class="subContent">Lokasi</h3>
                    <p class="dotSpacing">:</p>
                    <h3 class="subContent">${item.nama_ruangan || "-"}</h3>
                </div>

                <div class="info">
                    <h3 class="subContent">Status</h3>
                    <p class="dotSpacing">:</p>
                    <h3 class="subContent" style="color:${statusColor}; font-weight:bold;">${
      item.status
    }</h3>
                </div>

                <div class="info" style="align-items:flex-start;">
                    <h3 class="subContent">Catatan</h3>
                    <p class="dotSpacing">:</p>
                    <h3 class="subContent" style="font-weight:normal;">${
                      item.catatan || "-"
                    }</h3>
                </div>
            </div>
        `;

    container.appendChild(card);
  });
}

//download excel
function downloadHistory() {
  if (historyData.length === 0) {
    alert("Tidak ada data untuk diunduh.");
    return;
  }

  const excelData = historyData.map((item) => {
    return {
      Mahasiswa: item.nama_mahasiswa,
      "Dosen Pembimbing": item.nama_dosen,
      Tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
      Waktu: item.waktu,
      Lokasi: item.nama_ruangan || "-",
      Status: item.status,
      Catatan: item.catatan || "-",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Bimbingan");

  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `Riwayat_Bimbingan_Admin_${today}.xlsx`);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchRiwayatAdmin();

  const btnDownload = document.getElementById("downloadButton");
  if (btnDownload) {
    btnDownload.onclick = downloadHistory;
  }
});
