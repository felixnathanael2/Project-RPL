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
        // Langsung pindahkan user ke halaman login
        res.redirect("/page/LoginPage.html");
    }
}