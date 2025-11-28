document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector(".notificationContainer");

    // kalau container ga ketemu, berarti bukan di halaman notifikasi
    if (!container) return;

    try {
        const res = await fetch("/api/get-notifikasi", {
            credentials: "include",
        });

        console.log("HASIL RESPONSE RAW:", res);
        console.log("HASIL JSON:", await res.clone().json());

        const { data } = await res.json();

        console.log("HASIL API:", data);

        if (!res.ok) {
            container.innerHTML = `<p style="text-align:center; opacity:0.8">Gagal mengambil notifikasi.</p>`;
            return;
        }

        // kalo tidak ada notifikasi
        if (data.length === 0) {
            container.innerHTML = `<p style="text-align:center; opacity:0.8">Tidak ada notifikasi.</p>`;
            return;
        }

        // Render notifikasi
        container.innerHTML = data
            .map((notif) => {
                return `
            <div class="notifItem glass-box" style="opacity:${notif.is_read ? 0.6 : 1}">
                <div>
                    <p class="title">
                        ${notif.is_read ? "Notifikasi" : "Notifikasi Baru"}
                    </p>
                    <p>${notif.isi}</p>
                </div>

                <div class="date">
                    ${formatDate(notif.tanggal_waktu)}
                </div>
            </div>
        `;
            })
            .join("");
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p style="text-align:center; opacity:0.8">Terjadi kesalahan saat memuat notifikasi.</p>`;
    }
});

// 🔧 Format tanggal (opsional, biar rapi)
function formatDate(dateString) {
    const d = new Date(dateString);

    return d.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
