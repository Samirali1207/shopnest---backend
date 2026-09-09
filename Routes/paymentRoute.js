const express = require("express");
const {createdOrder , verifyPayment} = require("../Controllers/paymentController.js")
const router = express.Router()

router.post("/order", createdOrder);
router.post("/verify", verifyPayment);
router.get("/getkey", (req, res) => {
    res.status(200).json(process.env.RAZORPAY_KEY_ID)
})

module.exports = router;