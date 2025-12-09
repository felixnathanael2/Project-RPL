// Middleware Proteksi
// cek dlu udah login apa belum, kalo belom ya gabisa ngapa ngapain
export function protectRoute(req, res, next) {
  if (req.session.isLoggedIn) {
    req.user = {
      id: req.session.userId,
      email: req.session.email,
      role: req.session.role,
      name: req.session.userName,
    };
    next();
  } else {
    return res.redirect("/");
  }
}

export function protectAPI(req, res, next) {
  if (req.session.isLoggedIn) {
    req.user = {
      id: req.session.userId,
      email: req.session.email,
      role: req.session.role,
      name: req.session.userName,
    };
    return next();
  }

  return res.status(401).json({
    message: "Akses ditolak. Silakan login terlebih dahulu.",
  });
}
