const Order = require("../Models/order.js")
const sendEmail = require("../utils/sendEmail.js")


const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentId } = req.body;
        // console.log(req.body)
        if (!items || items.length === 0 || !totalAmount || !address) {
            return res.status(401).json({ message: "Invalid Order data" })
        }

        else {
            const order = new Order({
                user: req.user._id,
                items, totalAmount, paymentId, address
            })

            const message = `Dear ${req.user.name},\n\nThank you for your order! We truly appreciate your purchase and are excited to serve you.\n\nOrder Details\n\n- Order ID: ${order._id}\n- Shipping Address: ${address.fullName} , ${address.street}\n- Total Amount: ₹${totalAmount}\n\nYour order has been received and is now being processed. We'll keep you updated as it moves through the next stages.\n\nIf you have any questions regarding your order, feel free to contact our support team.\n\nBest Regards,\nShopNest Team`

            await order.save();
            await sendEmail(req.user.email, "Order created ", message)
            res.status(200).json({ message: "order created successfully ", order })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "error creating order", error })
    }
}

const myOrders = async (req, res) => {
    try {
        const myOrders = await Order.find({ user: req.user._id }).populate('items.productId', 'name price')

        res.status(200).json(myOrders)

    } catch (error) {
        return res.status(500).json({ message: "error finding orders" })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const AllOrders = await Order.find({}).populate('user', 'id name')

        res.status(200).json(AllOrders)

    } catch (error) {
        return res.status(500).json({ message: "error finding orders" })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id)
        if (order) {
            order.status = status;
            order.save();
            res.status(200).json({ message: "order status updated successfully ", order })
        }
        else {
            return res.status(401).json({ message: "order not found " })
        }
    } catch (error) {
        return res.status(500).json({ message: "error occured " })
    }
}

module.exports = { createOrder, myOrders, updateOrderStatus, getAllOrders }