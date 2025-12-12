let globalDataJadwal = {};

function updateCurrentDate() {
  const today = new Date();
  const namaHariIndo = ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const namaBulanIndo = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const hariID = document.getElementById("hari");
  const bulanID = document.getElementById("bulan");
  const tanggalID = document.getElementById("tanggal");

  if (hariID && bulanID && tanggalID) {
    hariID.textContent = namaHariIndo[today.getDay()];
    bulanID.textContent = namaBulanIndo[today.getMonth()];
    tanggalID.textContent = String(today.getDate()).padStart(2, "0");
  }
}

async function fetchJadwalBimbingan() {
  try {
    const response = await fetch("/api/jadwal-bimbingan");
    const rawData = await response.json();

    globalDataJadwal = {};

    rawData.forEach((item) => {
      const jamDisplay = item.waktu.substring(0, 5);

      let colorType = "green-bg";
      if (parseInt(jamDisplay.substring(0, 2)) >= 12) {
        colorType = "blue-bg";
      }

      if (!globalDataJadwal[item.tanggal]) {
        globalDataJadwal[item.tanggal] = [];
      }

      globalDataJadwal[item.tanggal].push({
        title: jamDisplay,
        name: item.nama_dosen,
        type: colorType,
      });
    });

    updateCalendarHeader();
    generateCalendarGrid(currentYear, currentMonth, globalDataJadwal);
  } catch (error) {
    console.error("Gagal mengambil jadwal kalender:", error);
  }
}

async function fetchJadwalMingguan() {
  try {
    const response = await fetch("/api/my-schedule");
    const result = await response.json();

    let formattedJadwal = [];
    const colors = [
      "bg-teal",
      "bg-pink",
      "bg-blue-dark",
      "bg-red",
      "bg-orange",
      "bg-olive",
      "bg-purple",
    ];

    if (result.status === "success" && Array.isArray(result.data)) {
      formattedJadwal = result.data.map((item) => ({
        day: item.hari,
        time: item.jam_mulai.substring(0, 5),
        end: item.jam_akhir.substring(0, 5),
        title: "Jadwal Kuliah",
        room: "R. Kuliah",
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
    }

    renderSchedule(formattedJadwal);
  } catch (error) {
    console.error("Gagal mengambil jadwal mingguan:", error);
  }
}

async function fetchRiwayatBimbingan() {
  try {
    const response = await fetch("/api/riwayat");
    const result = await response.json();

    const riwayatContainer = document.querySelector(".riwayat-list");
    if (!riwayatContainer) return;

    riwayatContainer.innerHTML = "";

    const data = result.data;

    if (!data || data.length === 0) {
      riwayatContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; opacity: 0.7;">
                    <p>Belum ada riwayat bimbingan.</p>
                </div>`;
      return;
    }

    data.forEach((item, index) => {
      const dateObj = new Date(item.tanggal);
      const dateBadge = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });

      let statusColor = "var(--cyan)";
      if (item.status === "Menunggu") statusColor = "#f59e0b";
      if (item.status === "Ditolak") statusColor = "#ef4444";
      if (item.status === "Disetujui") statusColor = "#10b981";

      const cardHTML = `
                <div class="history-card">
                    <div class="card-header">
                        <h5>Bimbingan ${data.length - index}</h5> 
                        <span class="date-badge">${dateBadge}</span>
                    </div>
                    <div class="card-body">
                        <p><i class="ri-user-star-line"></i> ${
                          item.nama || "Dosen"
                        }</p>
                        <p style="font-size: 11px; margin-top: -5px; opacity: 0.8;">
                           <i class="ri-map-pin-line"></i> ${
                             item.nama_ruangan || "-"
                           } • ${
        item.waktu ? item.waktu.substring(0, 5) : "--:--"
      }
                        </p>
                        <a href="/riwayat" class="detail-link" style="color: ${statusColor}">
                            Status: ${
                              item.status
                            } <i class="ri-arrow-right-line"></i>
                        </a>
                    </div>
                </div>
            `;
      riwayatContainer.insertAdjacentHTML("beforeend", cardHTML);
    });
  } catch (error) {
    console.error("Gagal mengambil riwayat:", error);
  }
}

function downloadTemplate() {
  const data = [
    { Hari: "Senin", Jam_Mulai: "07:00", Jam_Akhir: "09:30" },
    { Hari: "Selasa", Jam_Mulai: "10:00", Jam_Akhir: "12:00" },
    { Hari: "Rabu", Jam_Mulai: "13:00", Jam_Akhir: "15:00" },
  ];

  const wb = XLSX.utils.book_new();

  const ws = XLSX.utils.json_to_sheet(data);

  const wscols = [{ wch: 15 }, { wch: 15 }, { wch: 15 }];
  ws["!cols"] = wscols;

  XLSX.utils.book_append_sheet(wb, ws, "Template Jadwal");

  XLSX.writeFile(wb, "Template_Jadwal.xlsx");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCurrentDate();
  fetchJadwalBimbingan();
  fetchJadwalMingguan();
  fetchRiwayatBimbingan();

  const btnDownload = document.getElementById("downloadButton");
  if (btnDownload) {
    btnDownload.addEventListener("click", downloadTemplate);
  }

  const viewToggle = document.getElementById("viewToggle");
  const monthlyView = document.querySelector(".kalender-bulanan");
  const rightHeader = document.querySelector("#right-header");
  const weeklyView = document.querySelector(".kalender-mingguan");

  if (monthlyView) monthlyView.classList.remove("hidden");
  if (rightHeader) rightHeader.classList.remove("hidden");
  if (weeklyView) weeklyView.classList.add("hidden");

  if (viewToggle && monthlyView && weeklyView) {
    viewToggle.addEventListener("change", function () {
      if (this.checked) {
        monthlyView.classList.add("hidden");
        rightHeader.classList.add("hidden");
        weeklyView.classList.remove("hidden");
      } else {
        monthlyView.classList.remove("hidden");
        rightHeader.classList.remove("hidden");
        weeklyView.classList.add("hidden");
      }
    });
  }

  const btnNext = document.querySelector(".ri-arrow-right-s-line");
  const btnPrev = document.querySelector(".ri-arrow-left-s-line");

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }

      updateCalendarHeader();
      generateCalendarGrid(currentYear, currentMonth, globalDataJadwal);
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }

      updateCalendarHeader();
      generateCalendarGrid(currentYear, currentMonth, globalDataJadwal);
    });
  }
});
