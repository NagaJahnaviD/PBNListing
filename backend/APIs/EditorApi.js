const exp = require("express");
const router = exp.Router();
const upload = require("../Middleware/uploads"); // your existing middleware

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  console.log("debug")
  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(201).json({ url }); // returns a URL your editor can use
});

module.exports = router;
