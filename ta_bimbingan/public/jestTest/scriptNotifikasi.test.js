/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import { loadNotifications } from '../js/scriptNotifikasi.js';

describe('Notification Feature Unit Test', () => {

    beforeEach(() => {
        document.body.innerHTML = `<div class="notificationContainer"></div>`;
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('Menampilkan error jika API fail', async () => {
        global.fetch.mockRejectedValue(new Error("API Down"));
        await loadNotifications();
        const container = document.querySelector('.notificationContainer');
        expect(container.innerHTML).toContain('Terjadi kesalahan');
    });

    test('Menampilkan "Tidak ada notifikasi" jika data kosong', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ data: [] }),
            clone: () => ({ json: async () => ({ data: [] }) })
        });
        await loadNotifications();
        const container = document.querySelector('.notificationContainer');
        expect(container.innerHTML).toContain('Tidak ada notifikasi');
    });

    test('Render Data Notifikasi (Happy Path)', async () => {
        const mockData = [{
            id: 1,
            isi: "Bimbingan ACC",
            tanggal_waktu: "2025-11-20T10:30:00",
            is_read: 0
        }];

        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ data: mockData }),
            clone: () => ({ json: async () => ({ data: mockData }) })
        });

        await loadNotifications();

        const item = document.querySelector('.notif-item');
        expect(item).not.toBeNull();
        expect(item.innerHTML).toContain('Bimbingan ACC');
        // Cek titik merah (unread)
        expect(item.querySelector('.unread-dot')).not.toBeNull();
    });
});