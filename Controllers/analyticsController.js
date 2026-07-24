const Order = require("../Models/order")
const Product = require("../Models/Product")
const User = require("../Models/User")

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' })
        const totalOrders = await Order.countDocuments({})
        const totalProducts = await Product.countDocuments({})

        const orders = await Order.find({});

        const totalRevenueData = orders.reduce((acc, order) => acc + order.totalAmount, 0)

        return res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue: totalRevenueData
        })

    } catch (error) {
        return res.status(500).json({ message: "error getting adminStats " })
    }
}

module.exports = {getAdminStats}