const Razorpay = require("razorpay")
const crypto = require("crypto")
dotenv = require("dotenv").config()

const createdOrder = async (req, res) => {
    try {
        const instance = Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        const options = {
            amount: req.body.ampont * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex")
        }

        const order = await instance.orders.create(options)

        res.status(200).json(order)

    } catch (error) {
        return res.status(500).json({ message: "Internal server error " })
    }
}

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generated_signature = crypto.
            createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex")

        if (generated_signature === razorpay_signature) {
            res.status(200).json({ message: "Payment verified successfully " })
        }
        else {
            return res.status(401).json({ message: "Payment Not verified " })
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server errorr " })

    }
}

module.exports = {createdOrder , verifyPayment}