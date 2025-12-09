document.addEventListener('DOMContentLoaded', function () {
    const selectWrapper = document.querySelector('.custom-select');
    const selectTrigger = document.querySelector('.select-trigger');
    const selectOptions = document.querySelector('.select-options');
    const options = document.querySelectorAll('.option');
    const selectedText = document.getElementById('selectedStudent');

    // Toggle Dropdown
    selectTrigger.addEventListener('click', function (e) {
        e.stopPropagation();
        selectWrapper.classList.toggle('open');
    });

    // Pilih Opsi
    options.forEach(option => {
        option.addEventListener('click', function () {
            selectedText.textContent = this.textContent;
            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');

            const studentID = this.getAttribute('data-value');
            console.log("Mahasiswa terpilih ID:", studentID);

            selectWrapper.classList.remove('open');

            // DISINI NANTI TEMPAT LOAD DATA DARI DATABASE BERDASARKAN ID
            // loadBimbinganByStudent(studentID);
        });
    });

    // Tutup dropdown
    document.addEventListener('click', function (e) {
        if (!selectWrapper.contains(e.target)) {
            selectWrapper.classList.remove('open');
        }
    });

});

// EXTEND
function toggleAccordion(headerElement) {
    // Ambil parent item (.bimbingan-item)
    const item = headerElement.parentElement;
    item.classList.toggle('active');y
}

// // --- SIMULASI UPDATE DATABASE ---
// function updateCatatan(idBimbingan) {
//     // Ambil nilai textarea berdasarkan ID
//     const textArea = document.getElementById(`note-${idBimbingan}`);
//     const catatanBaru = textArea.value;
//
//     // Animasi tombol loading (opsional UI UX)
//     const btn = textArea.nextElementSibling.querySelector('button');
//     const originalText = btn.innerText;
//     btn.innerText = "Saving...";
//
//     // SIMULASI FETCH API KE BACKEND
//     console.log(`Mengirim Data ke Database...`);
//     console.log(`ID Bimbingan: ${idBimbingan}`);
//     console.log(`Catatan Baru: ${catatanBaru}`);
//
//     // Simulasi delay jaringan
//     setTimeout(() => {
//         alert("Catatan berhasil diperbarui!");
//         btn.innerText = originalText;
//     }, 1000);
//
//     /* CONTOH KODE BACKEND FETCH NANTI:
//
//     fetch('/api/update_catatan.php', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id: idBimbingan, catatan: catatanBaru })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if(data.success) alert("Berhasil!");
//     });
//     */
//