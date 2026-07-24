const express = require("express")
const router = express.Router()
const { registerUser, loginUser, getUsers , verifyUser } = require("../Controllers/userControllers")
const { protect } = require("../middleware/authMiddleware")
const { admin } = require("../middleware/adminMiddleware")

router.post("/register", registerUser)
router.post("/verify/:token", verifyUser)
router.post("/login", loginUser)
router.get("/getUsers",protect , admin ,  getUsers)

module.exports  = router