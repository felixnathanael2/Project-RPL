/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';

import {
    fetchJadwalBimbingan,
    generateCalendarGrid,
    fetchJadwalMingguan,
    getRowFromTime,
    jadwalKuliah
} from '../js/scriptCalender.js';

describe('Integrasi Kalender & Jadwal Kuliah', () => {

    // Setup Mock DOM sebelum setiap test
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="hari"></div>
            <div id="bulan"></div>
            <div id="tanggal"></div>
            
            <div id="right-header"><p></p></div>
            <div class="month_calendar"></div>
            
            <div id="scheduleGrid"></div>
            
            <input type="checkbox" id="viewToggle">
            <div class="kalender-bulanan"></div>
            <div class="kalender-mingguan"></div>
        `;

        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // --- TEST 1: Kalender Bulanan ---
    test('Kalender Bulanan: Fetch API & Render Event', async () => {
        // Data dummy mirip struktur DB bimbingan
        const mockBimbingan = [
            { tanggal: "2025-04-10", waktu: "10:00:00", nama_dosen: "Pak Budi" }
        ];

        global.fetch.mockResolvedValue({
            json: async () => mockBimbingan
        });

        await fetchJadwalBimbingan();

        // Panggil render grid manual utk bulan April 2025
        generateCalendarGrid(2025, 3); // 3 = April (0-index)

        // Cek apakah ada cell tanggal 10
        const cells = Array.from(document.querySelectorAll('.date-cell'));
        const cell10 = cells.find(c => c.querySelector('.date-num')?.textContent === '10');

        expect(cell10).toBeTruthy();

        // Cek apakah event masuk ke dalam cell
        const eventTitle = cell10.querySelector('.event-title');
        const eventName = cell10.querySelector('.event-name');

        expect(eventTitle.textContent).toBe('10:00');
        expect(eventName.textContent).toBe('Pak Budi');
    });

    // --- TEST 2: Helper Jadwal Mingguan ---
    test('Helper: getRowFromTime menghitung baris grid dengan benar', () => {
        // Jam 07:00 = (7-7)*2 + 1 = 1
        expect(getRowFromTime('07:00')).toBe(1);

        // Jam 07:30 = 1 + 1 = 2
        expect(getRowFromTime('07:30')).toBe(2);

        // Jam 09:00 = (9-7)*2 + 1 = 5
        expect(getRowFromTime('09:00')).toBe(5);
    });

    // --- TEST 3: Jadwal Kuliah Mingguan ---
    test('Jadwal Mingguan: Mapping Data & Render', async () => {
        // Data dummy dari DB (snake_case)
        const mockJadwalDB = {
            status: 'success',
            data: [
                {
                    hari: 'Senin',
                    jam_mulai: '07:00:00',
                    jam_akhir: '09:00:00'
                }
            ]
        };

        global.fetch.mockResolvedValue({
            json: async () => mockJadwalDB
        });

        await fetchJadwalMingguan();

        // 1. Cek apakah array jadwalKuliah terisi & ter-map dengan benar
        expect(jadwalKuliah.length).toBe(1);
        expect(jadwalKuliah[0].time).toBe('07:00'); // Substring(0,5) bekerja
        expect(jadwalKuliah[0].day).toBe('Senin');

        // 2. Cek Render di DOM
        const card = document.querySelector('.class-card');
        expect(card).toBeTruthy();

        // Cek posisi grid CSS
        // Senin = col 2 (di dayMap kamu)
        // 07:00 = row 1
        expect(card.style.gridColumn).toBe('2');
        expect(card.style.gridRow).toContain('1');
    });

});