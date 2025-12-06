const modal = document.getElementById('confirmModal');
const form = document.getElementById('submissionForm');

// Membuka Pop-up
function showModal() {
    // const nama = document.getElementById('nama').value;
    // const lokasi = document.getElementById('lokasi').value;
    // const tanggal = document.getElementById('tanggal').value;

    // if (nama.trim() !== "" && lokasi !== "" && tanggal !== "") {
    //     modal.classList.add('show');
    // // } else {
    //     alert("Mohon lengkapi Nama, Lokasi, dan Tanggal sebelum melanjutkan.");
    // }
}

// Tutup Pop-up
function closePopUp() {
    modal.classList.remove('show');
}

window.onclick = function(event) {
    if (event.target == modal) {
        closePopUp();
    }
}