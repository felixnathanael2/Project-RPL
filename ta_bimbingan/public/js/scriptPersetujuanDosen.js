async function fetchJadwalBimbingan() {
  try {
    const response = await fetch("/api/jadwal-bimbingan-dosen");

    if (!response.ok) {
      throw new Error(
        `Server Error: ${response.status} ${response.statusText}`
      );
    }

    const rawData = await response.json();

    console.log("Data diterima:", rawData);

    const container = document.querySelector(".persetujuan-list");
    container.innerHTML = "";

    if (!Array.isArray(rawData)) {
      console.error("Data bukan array:", rawData);
      container.innerHTML =
        "<p style='color:red; text-align:center;'>Format data salah dari server.</p>";
      return;
    }

    // Filter data
    const listMenunggu = rawData.filter((item) => item.status === "Menunggu");

    if (listMenunggu.length === 0) {
      container.innerHTML =
        "<p style='text-align:center; padding: 20px;'>Tidak ada permintaan bimbingan baru.</p>";
      return;
    }

    listMenunggu.forEach((item) => {
      const dateObj = new Date(item.tanggal);
      const dateStr = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const cardHTML = `
                <div class="persetujuan-card">
                    <div class="card-left">
                        <h4>${item.nama_mahasiswa || "Nama Tidak Ada"}</h4> 
                        <p><span class="key">Tanggal:</span> ${dateStr}</p>
                        <p><span class="key">Jam:</span> ${item.waktu}</p>
                        <p><span class="key">Lokasi:</span> ${
                          item.lokasi || "-"
                        }</p>
                        <p class="topik"><span class="key">Topik:</span> ${
                          item.catatan
                        }</p>
                    </div>
                    <div class="card-right">
                        <button class="btn tolak" onclick="updateStatus(${
                          item.id
                        }, 'Ditolak')">Tolak</button>
                        <button class="btn terima" onclick="updateStatus(${
                          item.id
                        }, 'Disetujui')">Terima</button>
                    </div>
                </div>
            `;
      container.insertAdjacentHTML("beforeend", cardHTML);
    });
  } catch (error) {
    console.error("Gagal mengambil jadwal:", error);
    const container = document.querySelector(".persetujuan-list");
    if (container)
      container.innerHTML = `<p style='text-align:center; color: #ffcccc;'>Gagal memuat data: ${error.message}</p>`;
  }
}

document.querySelector(".persetujuan-list").addEventListener("click", async function(e) {
    // Cek apakah yang diklik adalah tombol dengan class 'btn'
    const btn = e.target.closest(".btn");
    if (!btn) return;

    // Ambil data dari atribut HTML
    const idBimbingan = btn.getAttribute("data-id");
    const actionCode = parseInt(btn.getAttribute("data-action")); // 1 = Terima, 0 = Tolak
    
    let notes = "";

    // Jika tolak, minta alasan
    if (actionCode === 0) {
        notes = prompt("Masukkan alasan penolakan:");
        if (notes === null || notes.trim() === "") return; // Batal jika kosong
    }

    // UI Feedback (Loading)
    const originalText = btn.innerText;
    btn.innerText = "Memproses...";
    btn.disabled = true;

    try {
        // PERBAIKAN: URL fetch disesuaikan dengan routes.js ('/update-status')
        // PERBAIKAN: Tidak mengirim 'nik' dari sini, server yang akan ambil dari session
        const response = await fetch("/update-status", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_bimbingan: id_bimbingan,
                button: actionCode,
                notes: notes
            }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Hapus kartu dari tampilan dengan animasi fade out
            const card = document.getElementById(`card-${idBimbingan}`);
            if (card) {
                card.style.transition = "opacity 0.5s";
                card.style.opacity = '0';
                setTimeout(() => card.remove(), 500);
            }
            // Cek jika list kosong setelah dihapus
            setTimeout(() => {
                if(document.querySelectorAll('.persetujuan-card').length === 0){
                    document.querySelector(".persetujuan-list").innerHTML = "<p style='text-align:center; padding: 20px;'>Tidak ada permintaan bimbingan baru.</p>";
                }
            }, 500);
        } else {
            alert("Gagal update status: " + (result.message || "Unknown error"));
            btn.innerText = originalText;
            btn.disabled = false;
        }
    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan koneksi");
        btn.innerText = originalText;
        btn.disabled = false;
    }
});

document.addEventListener("DOMContentLoaded", fetchJadwalBimbingan);