const express = require("express")
const router = express.Router()

const { protect } = require("../middleware/authMiddleware")
const { admin } = require("../middleware/adminMiddleware")
const {createOrder , myOrders , updateOrderStatus , getAllOrders ,} = require("../Controllers/orderController")


router.route("/").post(protect , createOrder).get(protect , admin , getAllOrders )
router.route("/myOrders").get(protect , myOrders)
router.route("/:id/status").put(protect , admin ,  updateOrderStatus)


module.exports = router