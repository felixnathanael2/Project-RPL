document.addEventListener("DOMContentLoaded", () => {
    loadNotifications();
});

async function loadNotifications() {
    // Target container
    const container = document.querySelector('.notificationContainer');

    try {
        // Panggil API (Tidak perlu kirim ID manual, Backend sudah tahu dari Session)
        const response = await fetch('/api/get-notifikasi');

        const jsonResponse = await response.json();

        // Ambil array data dari respon controller { data: [...] }
        const notifikasiList = jsonResponse.data;

        // Kosongkan container
        container.innerHTML = '';

        // Cek jika data kosong
        if (!notifikasiList || notifikasiList.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding:20px; color: white;">Tidak ada notifikasi baru.</p>';
            return;
        }

        // 3. Render Loop Data
        notifikasiList.forEach(notif => {
            // Destructure data (sesuaikan nama kolom di DB/Query kamu)
            const { isi, is_read, tanggal_waktu } = notif;

            const dateObj = new Date(tanggal_waktu);

            // Format Jam (Contoh: 15:00)
            const timeString = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

            // Format Tanggal (Contoh: 1 April 2025)
            const dateString = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

            // Buat elemen div
            const notifItem = document.createElement('div');
            notifItem.className = 'notif-item';

            // Logic Dot Merah
            const unreadDotHTML = (is_read === 0 || is_read === false)
                ? '<div class="unread-dot"></div>'
                : '';

            // Masukkan HTML ke dalam item
            notifItem.innerHTML = `
                ${unreadDotHTML}
                <div class="notif-content">
                    ${isi}
                </div>
                <div class="notif-meta">
                    <span class="notif-time">${timeString}</span>
                    <span class="notif-date">${dateString}</span>
                </div>
            `;

            // Masukkan item ke container utama
            container.appendChild(notifItem);
        });

    } catch (error) {
        console.error("Error loading notifications:", error);
        container.innerHTML = '<p style="text-align:center; color:#ffcccc;">Gagal memuat notifikasi.</p>';
    }
}