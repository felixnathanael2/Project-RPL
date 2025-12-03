const modal = document.getElementById("confirmModal");
const form = document.getElementById("submissionForm");

// Membuka Pop-up (Validasi input)
function showModal() {
    const lokasi = document.getElementById("lokasi").value;
    const tanggal = document.getElementById("tanggal").value;
    const waktu = document.getElementById("waktu").value;
    const dosen = document.getElementById("dosen").value;

    if (lokasi && tanggal && waktu && dosen) {
        modal.classList.add("show");
    } else {
        alert("Mohon lengkapi semua data (Lokasi, Dosen, Tanggal, Waktu).");
    }
}

// Tutup Pop-up
function closePopUp() {
    modal.classList.remove("show");
}

async function submitFinal() {
    // 1. Ambil data dari form HTML
    const tanggalVal = document.getElementById("tanggal").value;
    const waktuVal = document.getElementById("waktu").value; // Format HH:mm
    const lokasiIdVal = document.getElementById("lokasi").value;
    const nikVal = document.getElementById("dosen").value;

    // 2. Siapkan data JSON sesuai req.body di Controller
    const payload = {
        tanggal: tanggalVal,
        waktu: waktuVal, 
        lokasiId: lokasiIdVal,
        nik: [nikVal] 
    };

    try {
        const response = await fetch("/api/ajukan-bimbingan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Pengajuan berhasil dikirim ke sistem!");
            closePopUp();
            form.reset();
            window.location.href = "/api/riwayat"; 
        } else {
            alert("Gagal mengajukan: " + (result.message || "Error server"));
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan koneksi.");
    }
}

window.onclick = function (event) {
    if (event.target == modal) {
        closePopUp();
    }
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();
});
