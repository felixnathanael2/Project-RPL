document.addEventListener("DOMContentLoaded", () => {
  // --- STATE MANAGEMENT ---
  const formData = {
    studentId: null,
    locationId: null,
    day: null,
    timeSlot: null,
  };

  const studentSelect = document.getElementById("NamaLengkap");
  const locationSelect = document.getElementById("lokasiSelect");
  const daySelect = document.getElementById("hariSelect");
  const timeSelect = document.getElementById("jamSelect");
  const btnSubmit = document.querySelector(".btn-update");

  init();

  function init() {
    setupDropdownUI();
    loadStudents();
    loadLocations();
  }

  function setupDropdownUI() {
    const selects = document.querySelectorAll(".custom-select");
    selects.forEach((select) => {
      const trigger = select.querySelector(".select-trigger");
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllSelects(select);
        select.classList.toggle("open");
      });
    });
    window.addEventListener("click", () => closeAllSelects(null));
  }

  function closeAllSelects(except) {
    document.querySelectorAll(".custom-select").forEach((s) => {
      if (s !== except) s.classList.remove("open");
    });
  }

  function populateDropdown(selectElement, items, onSelectCallback) {
    const optionsContainer = selectElement.querySelector(".select-options");
    const trigger = selectElement.querySelector(".select-trigger");
    optionsContainer.innerHTML = "";

    if (items.length === 0) {
      optionsContainer.innerHTML = `<span class="option disabled">Tidak ada data</span>`;
      return;
    }

    items.forEach((item) => {
      const option = document.createElement("span");
      option.classList.add("option");
      option.textContent = item.label;
      option.dataset.value = item.value;

      option.addEventListener("click", () => {
        trigger.textContent = item.label;
        optionsContainer
          .querySelectorAll(".option")
          .forEach((o) => o.classList.remove("selected"));
        option.classList.add("selected");
        selectElement.classList.remove("open");
        onSelectCallback(item.value);
      });

      optionsContainer.appendChild(option);
    });
  }

  // --- DATA LOADING ---
  async function loadStudents() {
    try {
      const response = await fetch("/api/get-mahasiswa"); 
      const json = await response.json();
      const data = json.data || json; 
      const formattedData = data.map((mhs) => ({
        label: `${mhs.nama}`,
        value: mhs.id_users,
      }));

      populateDropdown(studentSelect, formattedData, (value) => {
        formData.studentId = value;
        checkAvailability();
      });
    } catch (error) {
      console.error("Gagal memuat mahasiswa:", error);
    }
  }

  async function loadLocations() {
    try {
      const response = await fetch("/api/get-lokasi"); // Sesuaikan URL
      const json = await response.json();
      const data = json.data || json;

      const formattedData = data.map((loc) => ({
        label: loc.nama_ruangan,
        value: loc.id_lokasi,
      }));

      populateDropdown(locationSelect, formattedData, (value) => {
        formData.locationId = value;
      });
    } catch (error) {
      console.error("Gagal memuat lokasi:", error);
    }
  }

  const dayOptions = daySelect.querySelectorAll(".option");
  dayOptions.forEach((opt) => {
    opt.addEventListener("click", function () {
      daySelect.querySelector(".select-trigger").textContent = this.textContent;
      daySelect.classList.remove("open");
      formData.day = this.textContent.trim();
      checkAvailability();
    });
  });

  async function checkAvailability() {
    const timeTrigger = timeSelect.querySelector(".select-trigger");
    timeTrigger.textContent = "-- Loading Jadwal... --";

    if (!formData.studentId || !formData.day) {
      timeTrigger.textContent = "-- Pilih Mhs & Hari Dulu --";
      return;
    }

    try {
      const params = new URLSearchParams({
        npm: formData.studentId,
        hari: formData.day,
      });

      const response = await fetch(`/api/check-availability-dosen?${params}`);
      const availableSlots = await response.json();

      populateDropdown(timeSelect, availableSlots, (value) => {
        formData.timeSlot = value;
      });

      if (availableSlots.length > 0) {
        timeTrigger.textContent = "-- Pilih Jam --";
      } else {
        timeTrigger.textContent = "Tidak ada jadwal kosong";
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      timeTrigger.textContent = "Error memuat jadwal";
    }
  }

  btnSubmit.addEventListener("click", async function (e) {
    e.preventDefault();

    if (
      !formData.studentId ||
      !formData.locationId ||
      !formData.day ||
      !formData.timeSlot
    ) {
      alert("Harap lengkapi semua data: Mahasiswa, Lokasi, Hari, dan Jam.");
      return;
    }

    const isConfirmed = confirm(
      `Apakah Anda yakin ingin menjadwalkan bimbingan RUTIN setiap hari ${formData.day} ` +
        `jam ${formData.timeSlot} sampai akhir semester?`
    );

    if (!isConfirmed) return;

    const payload = {
      npm: formData.studentId,
      id_lokasi: formData.locationId,
      hari: formData.day,
      jam_mulai: formData.timeSlot,
    };

    const originalText = btnSubmit.innerText;
    btnSubmit.innerText = "Sedang Memproses...";
    btnSubmit.disabled = true;

    try {
      const response = await fetch("/api/submit-bimbingan-rutin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          `SUKSES!\n\n` +
            `${result.message}\n` +
            `Rentang: ${result.data.rentang}\n\n` +
            `Silakan cek menu Riwayat.`
        );
        window.location.href = "/riwayat";
      } else {
        alert("GAGAL MENYIMPAN:\n" + result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem/koneksi.");
    } finally {
      btnSubmit.innerText = originalText;
      btnSubmit.disabled = false;
    }
  });
});
