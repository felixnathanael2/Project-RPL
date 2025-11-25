// INI CUMA SIMULASI BUAT DI BD NYA
const mockRequests = [
    {
        id: 101,
        nama: "Joseph Davin Christian",
        tanggal: "24 April 2025",
        dosen: "Vania Natali",
        jam: "10.00",
        lokasi: "Lab Own Games",
        topik: "Prediksi Potensi Dropout Mahasiswa dari Nilai 1 Tahun Pertama"
    },
    {
        id: 102,
        nama: "Michael Gunawan",
        tanggal: "26 April 2025",
        dosen: "Vania Natali, Lionov",
        jam: "15.00",
        lokasi: "09.01.13",
        topik: "Optimasi Pemilihan Umpan (Lure) Menggunakan AI"
    },
    {
        id: 103,
        nama: "Michael Gunawan",
        tanggal: "30 April 2025",
        dosen: "Vania Natali",
        jam: "11.00",
        lokasi: "Ruang Dosen",
        topik: "Analisis Sentimen Pasar Saham"
    }
];

let currentRejectId = null; // Menyimpan ID item yang sedang ingin ditolak

// Masukan Data ke HTML
function renderApprovalList() {
    const container = document.getElementById('approvalList');
    container.innerHTML = "";

    if (mockRequests.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:20px;">Tidak ada permintaan persetujuan saat ini.</p>`;
        return;
    }

    mockRequests.forEach(req => {
        // Template String untuk Card
        const itemHTML = `
            <div class="approval-item" id="req-${req.id}">
                <div class="item-info">
                    <div class="student-name">${req.nama}</div>
                    <div class="item-details">
                        <span class="detail-label">Tanggal</span> <span class="detail-sep">:</span> <span class="detail-val">${req.tanggal}</span>
                        <span class="detail-label">Dosen</span>   <span class="detail-sep">:</span> <span class="detail-val">${req.dosen}</span>
                        <span class="detail-label">Jam</span>     <span class="detail-sep">:</span> <span class="detail-val">${req.jam}</span>
                        <span class="detail-label">Lokasi</span>  <span class="detail-sep">:</span> <span class="detail-val">${req.lokasi}</span>
                        <span class="detail-label">Topik</span>   <span class="detail-sep">:</span> <span class="detail-val">${req.topik}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-action btn-reject" onclick="openRejectModal(${req.id})">Tolak</button>
                    <button class="btn-action btn-accept" onclick="handleAccept(${req.id})">Terima</button>
                </div>
            </div>
        `;
        container.innerHTML += itemHTML;
    });
}

function handleAccept(id) {
    if (confirm("Apakah anda yakin ingin menyetujui bimbingan ini?")) {
        // Simulasi API Call
        console.log(`[API] Menyetujui request ID: ${id}`);

        removeFromList(id);
        alert("Bimbingan berhasil disetujui!");
    }
}

// Tolak Bimbingan
const modal = document.getElementById('rejectModal');
const reasonInput = document.getElementById('rejectReason');

function openRejectModal(id) {
    currentRejectId = id;
    reasonInput.value = "";
    modal.classList.add('show');
}

function closeModal() {
    modal.classList.remove('show');
    currentRejectId = null;
}

function submitRejection() {
    const reason = reasonInput.value.trim();

    if (!reason) {
        alert("Harap isi alasan penolakan!");
        return;
    }

    if (currentRejectId) {
        // Simulasi API Call
        console.log(`[API] Menolak request ID: ${currentRejectId}`);
        console.log(`[API] Alasan: ${reason}`);

        // Hapus dari tampilan
        removeFromList(currentRejectId);

        closeModal();
        alert("Permintaan bimbingan telah ditolak.");
    }
}

function removeFromList(id) {
    const index = mockRequests.findIndex(r => r.id === id);
    if (index > -1) {
        mockRequests.splice(index, 1);
        renderApprovalList();
    }
}

document.addEventListener('DOMContentLoaded', renderApprovalList);

window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}