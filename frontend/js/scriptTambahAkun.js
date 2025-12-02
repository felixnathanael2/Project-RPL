// Tampilkan popup
function showModal() {
    document.getElementById("confirmPopup").classList.add("show");
}

// Tombol YA
document.getElementById("yesBtn").onclick = function () {
    // Lakukan aksi di sini, misalnya submit form:
    // document.getElementById("submissionForm").submit();

    document.getElementById("confirmPopup").classList.remove("show");
};

// Tombol TIDAK
document.getElementById("noBtn").onclick = function () {
    document.getElementById("confirmPopup").classList.remove("show");
};