document.addEventListener("DOMContentLoaded", async () => {
<<<<<<< HEAD
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
        const d = new Date(notif.tanggal_waktu);
        const timeStr = d.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const dateStr = d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        // Cek belum dibaca (0 = belum, 1 = sudah)
        const isUnread = notif.is_read == 0;
        return `

            <div class="notif-item" style="opacity:${notif.is_read ? 0.8 : 1}">
                ${isUnread ? '<div class="unread-dot"></div>' : ""}
=======
    const container = document.querySelector(".notificationContainer");

    // kalau container ga ketemu, berarti bukan di halaman notifikasi
    if (!container) return;

    try {
        const res = await fetch("/api/get-notifikasi", {
            credentials: "include",
        });

        console.log("HASIL RESPONSE RAW:", res);
        console.log("HASIL JSON:", await res.clone().json());

        const {data} = await res.json();

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
                const d = new Date(notif.tanggal_waktu);
                const timeStr = d.toLocaleTimeString("id-ID", {hour: "2-digit", minute: "2-digit"});
                const dateStr = d.toLocaleDateString("id-ID", {day: "numeric", month: "long", year: "numeric"});

                // Cek belum dibaca (0 = belum, 1 = sudah)
                const isUnread = notif.is_read == 0;
                return `

            <div class="notif-item" style="opacity:${notif.is_read ? 0.8 : 1}">
                ${isUnread ? '<div class="unread-dot"></div>' : ''}
>>>>>>> 19f811bb5f83c7ae8dbbd45cad9234ee6266ffef
                <div class="notif-content">
                    ${notif.isi}
                </div>
                <div class="notif-meta">
                    <span class="notif-time">${timeStr}</span>
                    <span class="notif-date">${dateStr}</span>
                </div>
            </div>
        `;
<<<<<<< HEAD
      })
      .join("");
  } catch (error) {
    console.error(error);
    container.innerHTML = `<p style="text-align:center; opacity:0.8">Terjadi kesalahan saat memuat notifikasi.</p>`;
  }
=======
            })
            .join("");
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p style="text-align:center; opacity:0.8">Terjadi kesalahan saat memuat notifikasi.</p>`;
    }
>>>>>>> 19f811bb5f83c7ae8dbbd45cad9234ee6266ffef
});

// 🔧 Format tanggal (opsional, biar rapi)
function formatDate(dateString) {
<<<<<<< HEAD
  const d = new Date(dateString);

  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
=======
    const d = new Date(dateString);

    return d.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
>>>>>>> 19f811bb5f83c7ae8dbbd45cad9234ee6266ffef
}
