let selectedBimbinganId = null;

//ngambil data dari backend pake api 
async function fetchJadwalBimbingan() {
    try {
        const response = await fetch("/api/jadwal-bimbingan-dosen");
        if (!response.ok) throw new Error(`Server Error: ${response.status}`);
        
        const rawData = await response.json();
        const container = document.querySelector(".persetujuan-list");
        container.innerHTML = "";
        //pilih aja yang statusnya masih menunggu
        const listMenunggu = rawData.filter((item) => item.status === "Menunggu");

        //kalo ga ada data 
        if (listMenunggu.length === 0) {
            container.innerHTML = "<p style='text-align:center; padding: 20px;'>Tidak ada permintaan bimbingan baru.</p>";
            return;
        }

        // untuk setiap object dari backend bikin format cardsnya untuk frontend
        listMenunggu.forEach((item) => {
            const idBimbingan = item.id_bimbingan || item.id; 
            const dateStr = item.tanggal; 

            const cardHTML = `
                <div class="persetujuan-card" id="card-${idBimbingan}">
                    <div class="card-left">
                        <h4>${item.nama_mahasiswa || "Mahasiswa"}</h4>
                        <p><span class="key">Tanggal:</span> ${dateStr}</p>
                        <p><span class="key">Jam:</span> ${item.waktu}</p>
                        <p><span class="key">Lokasi:</span> ${item.ruangan || "-"}</p>
                    </div>
                    <div class="card-right">
                        <button class="btn tolak" data-id="${idBimbingan}" data-action="0">Tolak</button>
                        <button class="btn terima" data-id="${idBimbingan}" data-action="1">Terima</button>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", cardHTML);
        });

    } catch (error) {
        console.error("Gagal fetch:", error);
    }
}

//untuk menentukan apakah status bimbingan menjadi diterima atau ditolak
document.querySelector(".persetujuan-list").addEventListener("click", function(e) {
    const btn = e.target.closest(".btn");
    if (!btn) return;

    const idBimbingan = btn.dataset.id;
    const actionCode = btn.dataset.action; // 1 = terima, 0  = tolak
    if (actionCode === "1") {
        //langusng kirim data ke backend ga perlu pop up alesan penolakamn
        updateStatusBimbingan(idBimbingan, 1, "-");
    } else {
        //buka alasan penolakan
        bukaPopupTolak(idBimbingan);
    }
});

const modal = document.getElementById("rejectModal");
const inputAlasan = document.getElementById("input-areatext");

//show modal / pop up 
function bukaPopupTolak(id) {
    selectedBimbinganId = id; 
    inputAlasan.value = ""; 
    modal.classList.remove("hidden"); 
}

//hide lagi modal / pop up
function tutupPopupTolak() {
    selectedBimbinganId = null;
    modal.classList.add("hidden");
}

//kalo btn cancel di pop up di pencet 
document.getElementById("btnCancelReject").addEventListener("click", tutupPopupTolak);

//kalo btn confirm di pop up di pencet
document.getElementById("btnConfirmReject").addEventListener("click", function() {
    const alasan = inputAlasan.value.trim();
    
    if (!alasan) {
        alert("Harap isi alasan penolakan.");
        return;
    }

    updateStatusBimbingan(selectedBimbinganId, 0, alasan);
    
    tutupPopupTolak();
});

//update status bimbingan di backend (action : 1 = terima, 0 = tolak)
async function updateStatusBimbingan(id, action, notes) {
  //pilih dulu kartunya bedasarkan id bimbingan 
    const card = document.getElementById(`card-${id}`);
    if(!card) return;

    try { //panggil api untuk update status
        const response = await fetch("/api/update-status-bimbingan", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_bimbingan: id,
                button: action, 
                notes: notes
            }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            card.style.transition = "opacity 0.5s";
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
                if(document.querySelectorAll('.persetujuan-card').length === 0){
                    document.querySelector(".persetujuan-list").innerHTML = "<p style='text-align:center; padding: 20px;'>Tidak ada permintaan bimbingan baru.</p>";
                }
            }, 500);

            alert(result.message);
        } else {
            alert("Gagal: " + result.message);
        }
    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan koneksi");
    }
}

document.addEventListener("DOMContentLoaded", fetchJadwalBimbingan);