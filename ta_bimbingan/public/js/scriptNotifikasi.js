document.addEventListener("DOMContentLoaded", async () => {
    const container = document.querySelector(".notificationContainer");
    if (!container) return;

    try {
        const res = await fetch("/api/get-notifikasi", {
            credentials: "include",
        });

        const { data } = await res.json();
        if (!res.ok) {
            container.innerHTML = `<p style="text-align:center; opacity:0.8">Gagal mengambil notifikasi.</p>`;
            return;
        }

        if (data.length === 0) {
            container.innerHTML = `<p style="text-align:center; opacity:0.8">Tidak ada notifikasi.</p>`;
            return;
        }

        // --- RENDER NOTIF ---
        container.innerHTML = data
            .map((notif) => {
                return `
                <div class="notifItem glass-box" data-id="${notif.id}">
                    <div class="left">
                        <p class="notif-title">${notif.is_read ? "Notifikasi" : "Notifikasi Baru"}</p>
                        <p class="notif-body">${notif.isi}</p>
                    </div>

                    <div class="right">
                        <span class="notif-date">${formatDate(notif.tanggal_waktu)}</span>
                        ${notif.is_read ? "" : `<div class="unread-dot"></div>`}
                    </div>
                </div>
            `;
            })
            .join("");

        // --- EVENT CLICK UNTUK BACA NOTIF ---
        document.querySelectorAll(".notifItem").forEach((box) => {
            box.addEventListener("click", async () => {
                const id = box.dataset.id;

                try {
                    const res = await fetch(`/api/notifikasi-read/${id}`, {
                        method: "PUT",
                    });
                    const result = await res.json();

                    if (result.success) {
                        // ubah title
                        box.querySelector(".notif-title").textContent =
                            "Notifikasi";

                        // hilangkan dot merah
                        const dot = box.querySelector(".unread-dot");
                        if (dot) dot.remove();

                        // tandai sebagai read
                        box.classList.add("read");
                    }
                } catch (err) {
                    console.error(err);
                }
            });
        });
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p style="text-align:center; opacity:0.8">Terjadi kesalahan.</p>`;
    }
});

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
