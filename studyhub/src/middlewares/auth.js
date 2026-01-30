export function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.redirect("/auth/login");
}

export function ensureAdmin(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user?.role === "admin") return next();
  return res.status(403).send("Forbidden");
}
