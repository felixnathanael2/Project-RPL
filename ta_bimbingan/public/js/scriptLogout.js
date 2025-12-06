document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("btn-logout-action");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
            e.preventDefault(); 

            try {
                const response = await fetch("/api/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    window.location.href = "/";
                } else {
                    const result = await response.json();
                    alert(result.message || "Gagal logout");
                }
            } catch (error) {
                console.error("Error saat logout:", error);
                alert("Terjadi kesalahan koneksi.");
            }
        });
    }
});