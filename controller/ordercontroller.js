const { func } = require("joi");
const Order = require("../models/order");
const { User } = require("../models/user");

//create order
module.exports.createOrder = async (req, res) => {
  try {
    let order = await User.findOne(req.user);
    if (!order) return res.status(404).json("user token not found");

    if (req.user._id === req.body.userId) {
      order = new Order(req.body);
      const savedorder = await order.save();
      res.status(201).json(savedorder);
    } else {
      res.status(200).json("UserId or Token Invalid");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//update order
module.exports.updateorder = async (req, res) => {
  try {
    let order = await User.findOne(req.user);
    if (!order) return res.status(404).json("Admin Token not found");

    const uporder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!uporder) return res.status(404).json("Order_Id not found");

    res.status(200).json(uporder);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//delete Order by Id
module.exports.deleteOrder = async (req, res) => {
  try {
    let order = await User.findOne(req.user);
    if (!order) return res.status(404).json("Admin Token not found");

    order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json("Order_Id not found");

    res.status(200).json("Order was delete successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//get user Order by UserId
module.exports.getuserorder = async (req, res) => {
  try {
    let order = await User.findOne(req.user);
    if (!order) return res.status(404).json("user Token not found");

    if (req.user._id === req.params.userId) {
      order = await Order.find({ userId: req.params.userId });
      if (!order) return res.status(404).json("User order not found");
      res.status(200).json(order);
    } else {
      res.status(404).json("user token or userId Invalid");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//Get All Orders
module.exports.findallorders = async (req, res) => {
  try {
    let order = await User.findOne(req.user);
    if (!order) return res.status(404).json("Admin Token not found");

    let orders = await Order.find().populate("userId", "email");
    if (!orders) return res.status(404).json("order list is empty");
    res.status(200).json(orders);
  } catch (error) {
    res.status(200).json(error.message);
  }
};
