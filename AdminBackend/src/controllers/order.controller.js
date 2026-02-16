const Cart = require("../models/cart-model");
const Order = require("../models/order.model");

/**
 * CREATE ORDER
 */
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.body;

    // 1. Get user cart
    const cart = await Cart.findOne({ userId });
    // console.log(cart)

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    // 2. Create order
  const totalAmount = cart.items.reduce((sum, item) => {
  return sum + item.price * item.quantity;
}, 0);

const order = await Order.create({
  userId,
  addressId,
  items: cart.items.map(item => ({
    productId: item.productId,
    title: item.title,
    quantity: item.quantity,
    priceAtPurchase: item.price
  })),
  totalAmount
});

    // 3. Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order._id
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET USER ORDERS
 */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET ORDER DETAILS
 */
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("addressId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
