function showModal() {
    document.getElementById("confirmPopup").style.display = "flex";
}

document.getElementById("yesBtn").onclick = function () {
    alert("Data berhasil dikirim!"); 
    document.getElementById("confirmPopup").style.display = "none";
};

document.getElementById("noBtn").onclick = function () {
    document.getElementById("confirmPopup").style.display = "none";
};