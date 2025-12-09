async function fetchPermintaan() {
  try {
    //ambil semua bimbingan dulu dari backend
    const response = await fetch("/api/riwayat");

    if (!response.ok) throw new Error("Gagal mengambil data");

    const result = await response.json();
    const container = document.querySelector(".requests-container");
    container.innerHTML = "";
    const data = result.data;
    //ambil yang menunggu aja satatusnya
    const listMenunggu = data.filter((item) => item.status === "Menunggu");

    if (listMenunggu.length === 0) {
      container.innerHTML = `
                <div style="text-align:center; padding: 2rem;">
                    <i class="ri-checkbox-circle-line" style="font-size: 3rem; opacity: 0.5;"></i>
                    <p>Tidak ada permintaan bimbingan yang sedang menunggu.</p>
                </div>`;
      return;
    }

    //bikin cardsnya untuk di frontend
    listMenunggu.forEach((item) => {
      //formatting tanggal
      const dateObj = new Date(item.tanggal);
      const dateStr = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const jamStr = item.waktu ? item.waktu.substring(0, 5) : "-";

      const cardHTML = `
                <div class="request-card">
                    <div class="card-left" style="width: 100%;">
                        <h3 class="lecturer-name">${
                          item.nama || "Dosen Pembimbing"
                        }</h3>
                        
                        <div class="info-grid">
                            <span class="label">Tanggal</span>
                            <span class="separator">:</span>
                            <span class="value">${dateStr}</span>

                            <span class="label">Jam</span>
                            <span class="separator">:</span>
                            <span class="value">${jamStr}</span>

                            <span class="label">Lokasi</span>
                            <span class="separator">:</span>
                            <span class="value">${
                              item.nama_ruangan || "-"
                            }</span>

                            <span class="label">Status</span>
                            <span class="separator">:</span>
                            <span class="value" style="color: #f59e0b; font-weight: bold;">Menunggu Konfirmasi</span>
                        </div>
                    </div>
                    
                    </div>
            `;

      container.insertAdjacentHTML("beforeend", cardHTML);
    });
  } catch (error) {
    console.error("Error:", error);
    document.querySelector(
      ".requests-container"
    ).innerHTML = `<p style="color:red; text-align:center;">Gagal memuat data.</p>`;
  }
}

// Jalankan saat load
document.addEventListener("DOMContentLoaded", fetchPermintaan);
