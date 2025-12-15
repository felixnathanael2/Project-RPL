document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("btn-logout-action"); // Ambil tombol Logout

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault(); 

            // Mengirim permintaan logout
            try {
                const response = await fetch("/api/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                // Jika Sukses
                if (response.ok) {
                    window.location.href = "/";
                } else { // Jika gagal
                    const result = await response.json();
                    alert(result.message || "Gagal logout");
                }
            } catch (error) { // Kasih error message
                console.error("Error saat logout:", error);
                alert("Terjadi kesalahan koneksi.");
            }
        });
    }
});