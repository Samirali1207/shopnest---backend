const express = require("express");
const admin = require("../middleware/adminMiddleware")
const protect = require("../middleware/authMiddleware");
const router = express.Router()

const { getAdminStats } = require("../Controllers/analyticsController.js")

router.get("/", getAdminStats)

module.exports = router