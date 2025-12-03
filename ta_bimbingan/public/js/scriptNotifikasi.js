// notification.js
// Tambahkan export async function
export async function loadNotifications() {
    const container = document.querySelector(".notificationContainer");
    if (!container) return;

    try {
        const res = await fetch("/api/get-notifikasi", {
            credentials: "include",
        });

        if (!res.ok) {
            container.innerHTML = `<p style="text-align:center; opacity:0.8">Gagal mengambil notifikasi.</p>`;
            return;
        }

        // Handle method clone() agar kompatibel
        let data;
        if(typeof res.clone === 'function') {
            const json = await res.json();
            data = json.data;
        } else {
            const json = await res.json();
            data = json.data;
        }

        if (!data || data.length === 0) {
            container.innerHTML = `<p style="text-align:center; opacity:0.8">Tidak ada notifikasi.</p>`;
            return;
        }

        container.innerHTML = data
            .map((notif) => {
                const d = new Date(notif.tanggal_waktu);
                const timeStr = d.toLocaleTimeString("id-ID", {hour: "2-digit", minute: "2-digit"});
                const dateStr = d.toLocaleDateString("id-ID", {day: "numeric", month: "long", year: "numeric"});
                const isUnread = notif.is_read == 0;
                return `
            <div class="notif-item" style="opacity:${notif.is_read ? 0.8 : 1}">
                ${isUnread ? '<div class="unread-dot"></div>' : ''}
                <div class="notif-content">${notif.isi}</div>
                <div class="notif-meta">
                    <span class="notif-time">${timeStr}</span>
                    <span class="notif-date">${dateStr}</span>
                </div>
            </div>`;
            })
            .join("");
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p style="text-align:center; opacity:0.8">Terjadi kesalahan saat memuat notifikasi.</p>`;
    }
}

if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", loadNotifications);
}