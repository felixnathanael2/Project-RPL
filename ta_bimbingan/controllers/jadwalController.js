import { getUnavailable } from "../services/jadwalService.js";

export const checkAvailability = async (req, res) => {
    // ambil tanggal dan dosen ybs dari query di browser nya
    // query tuh mksdnya yg kyk ...?date=2025-11-20&dosenIds=123,456
    const { date, nik } = req.query;

    // kalo di front end nya ga di default data ininya, drpd error
    if (!date || !nik) return res.json({ availableSlots: [] });

    try {
        const dosenArray = nik.split(",");

        // bikin semua kemungkinan slot jam (7-17 (jam kerja))
        const rangeJam = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

        // ambil slot yang udah keiisi (sibuk) dari db
        const sibuk = await getUnavailable(date, dosenArray, req.user.id);

        // di filter buat cari jam berapa aja yang available
        // konsep filter tuh jadi, coba loop dari semua rangeJam, terus masukin jam dengan kondisi => ...
        // kondisinya itu berarti masukin jam, kalo misalnya di sibuk tuh gada jam itu, kalo misal ada jadi gausa dimasukkin
        const jamAvailable = rangeJam.filter(jam => !sibuk.includes(jam));

        //return si data json nya
        res.json({ jamAvailable });
    } catch (e) {
        // statements
        console.log(e);
    }
};