document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetForm");
  const emailInput = document.getElementById("email");
  const step2Container = document.getElementById("step2Container");
  const actionButton = document.getElementById("actionButton");

  // console.log("aaaa");

  // kasih step agar tau dah nyampe mana
  let currentStep = 1;
  if (!form) {
    console.error("Form not found");
    return;
  }

 // Dipanggil ketika tombol 'submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    // MINTA OTP
    if (currentStep === 1) {
      try {
        actionButton.textContent = "Loading...";
        actionButton.disabled = true;

        const response = await fetch("/api/lupapass/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Kode OTP Anda adalah " + result.token);
          currentStep = 2;
          // Munculkan kolom OTP
          if (step2Container) {
            step2Container.classList.remove("hidden");
          }
          emailInput.disabled = true;
          actionButton.textContent = "Ganti Password";
        } else {
          alert(result.message || "Gagal mengirim OTP");
        }
      } catch (error) {
        console.error("Error Step 1:", error);
        alert("Terjadi kesalahan sistem.");
      } finally {
        actionButton.disabled = false;
        if (currentStep === 1) actionButton.textContent = "Kirim OTP";
      }
    }

    // RESET PASSWORD
    else if (currentStep === 2) {
      const otp = document.getElementById("otp").value;
      const newPassword = document.getElementById("newPassword").value;

      if (!otp || !newPassword) {
        alert("Mohon isi Kode OTP dan Password Baru!");
        return;
      }

      try {
        actionButton.textContent = "Memproses...";
        actionButton.disabled = true;

        const response = await fetch("/api/lupapass/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            token: otp,
            newPassword: newPassword,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Sukses! Password berhasil diganti. Silakan Login.");
          window.location.href = "/login";
        } else {
          alert(result.message || "Gagal mereset password");
        }
      } catch (error) {
        console.error("Error Step 2:", error);
        alert("Terjadi kesalahan saat reset password.");
      } finally {
        actionButton.disabled = false;
        actionButton.textContent = "Ganti Password";
      }
    }
  });
});
