const loginForm = document.getElementById("loginForm");
const messageEl = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageEl.textContent = "Sedang memproses...";

    const userInput = document.querySelectorAll(".userInput");

    const email = userInput[0].value.trim();
    const password = userInput[1].value.trim();

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem("userName", result.user.name);
            localStorage.setItem("userRole", result.user.role);
            window.location.href = "/dashboard";
        } else {
            messageEl.textContent = result.message || "Login gagal.";
        }
    } catch (error) {
        console.error(error);
        messageEl.textContent = "Gagal menghubungi server.";
    }
});
