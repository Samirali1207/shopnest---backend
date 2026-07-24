const express = require("express");
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config();
const connectDb = require("./Config/db")
const authRoutes = require("./Routes/authRoute")
const productRoute = require("./Routes/productRoute")
const orderRoute = require("./Routes/orderRoute.js")
const paymentRoute = require("./Routes/paymentRoute.js")
const analyticsRoute = require("./Routes/analyticsRoute.js")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    
}))

connectDb()

app.get("/", (req, res) => {
    res.send("server is running on port 5000")
})

app.use("/api/auth", authRoutes)
app.use("/api/product", productRoute)
app.use("/api/order", orderRoute)
app.use("/api/payment", paymentRoute)
app.use("/api/analytics", analyticsRoute )

const PORT = process.env.PORT

app.listen(PORT || 5000, console.log(`server is runing on port ${PORT}`))