
// Dropdown Logic

const selects = document.querySelectorAll('.custom-select');

selects.forEach(select => {
    const trigger = select.querySelector('.select-trigger');
    const options = select.querySelector('.select-options');
    const optionItems = select.querySelectorAll('.option');

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close all other dropdowns
        selects.forEach(s => {
            if (s !== select) {
                s.classList.remove('open');
            }
        });
        // Toggle current dropdown
        select.classList.toggle('open');
    });

    optionItems.forEach(option => {
        option.addEventListener('click', () => {
            trigger.textContent = option.textContent;
            options.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            select.classList.remove('open');
        });
    });
});

window.addEventListener('click', e => {
    selects.forEach(select => {
        select.classList.remove('open');
    });
});

// Form submission handling
document.querySelector('.btn-update').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Get form values
    const nama = document.querySelector('input[placeholder="Masukkan nama lengkap anda"]').value;
    const email = document.querySelector('input[placeholder="Masukan email mahasiswa bimbingan"]').value;
    const lokasi = document.querySelector('#lokasiSelect .select-trigger').textContent;
    const penjadwalan = document.querySelector('#penjadwalanSelect .select-trigger').textContent;
    const hari = document.querySelector('#hariSelect .select-trigger').textContent;
    
    // Basic validation
    if (!nama || !email) {
        alert('Harap isi nama lengkap dan email mahasiswa');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Format email tidak valid');
        return;
    }
    
    // Show success message (you can replace this with actual form submission)
    alert(`Pengajuan bimbingan berhasil!\n\nNama: ${nama}\nEmail: ${email}\nLokasi: ${lokasi}\nPenjadwalan: ${penjadwalan}\nHari: ${hari}`);
    
    // Reset form (optional)
    // document.querySelector('form').reset();
});
