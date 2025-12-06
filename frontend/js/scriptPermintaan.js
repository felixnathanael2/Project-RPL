// Tampilkan popup
function showModal() {
    document.getElementById("confirmPopup").classList.remove("hide");
}

// const rejectButtons = document.querySelectorAll(".btn-reject");
// for(let rejectButton of rejectButtons){
//     rejectButton.addEventListener("clicked", showModal);
// }

// Tombol YA
document.getElementById("kirim").onclick = function () {
    document.getElementById("confirmPopup").classList.add("hide");
};

// Tombol TIDAK
document.getElementById("batal").onclick = function () {
    document.getElementById("confirmPopup").classList.add("hide");
};

// document.getElementById("batalButton").onclick = function () {
//     window.location.href = "TambahPenggunaAdmin.html";
// };
