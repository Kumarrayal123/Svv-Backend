const express = require("express");
const router = express.Router();
const {
  getContent,
  updateContent,
  uploadImageFile,
  resetContent,
} = require("../controllers/contentController");
const upload = require("../middleware/upload");

router.get("/", getContent);
router.put("/", updateContent);
router.post("/upload", upload.single("image"), uploadImageFile);
router.post("/reset", resetContent);

module.exports = router;
