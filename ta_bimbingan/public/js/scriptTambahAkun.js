// Tampilkan popup
function showModal() {
    document.getElementById("confirmPopup").classList.add("show");
}

// Tombol YA
document.getElementById("yesBtn").onclick = function () {
    document.getElementById("confirmPopup").classList.remove("show");
};

// Tombol TIDAK
document.getElementById("noBtn").onclick = function () {
    document.getElementById("confirmPopup").classList.remove("show");
};

document.getElementById("batalButton").onclick = function () {
    window.location.href = "TambahPenggunaAdmin.html";
};