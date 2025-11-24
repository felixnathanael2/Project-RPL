// Middleware Proteksi
// cek dlu udah login apa belum, kalo belom ya gabisa ngapa ngapain
export function protectRoute(req, res, next) {
    if (req.session.isLoggedIn) {
        req.user = { 
            id: req.session.userId, 
            role: req.session.role,
            name: req.session.userName,
        };
        next();
    } else {
        res
            .status(401)
            .json({ message: "Akses ditolak. Silakan login terlebih dahulu." });
    }
}