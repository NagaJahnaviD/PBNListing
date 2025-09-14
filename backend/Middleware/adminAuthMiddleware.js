const jwt = require("jsonwebtoken");

function adminAuthMiddleware(req, res, next) {
  console.log(req.cookies)
  const token = req.cookies.adminToken; // ✅ comes from cookie
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.admin = decoded;
    req.admin = { adminId: decoded.adminId };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = adminAuthMiddleware;
