import jwt from "jsonwebtoken";

export const generateJWT = (userId,role,expire=process.env.JWT_EXPIRES) => {
    const token = jwt.sign({userId,role},process.env.JWT_SECRET,{expiresIn:expire});
    return token;
}

export const verifyToken = (token) => {
    return jwt.verify(token,process.env.JWT_SECRET);
}



// // controllers/orderController.js

// const Order = require('../models/order');

// // Create a new order
// exports.createOrder = async (req, res) => {
//   try {
//     const { userId, courseId, totalPrice } = req.body;
//     const order = new Order({ userId, courseId, totalPrice });
//     await order.save();
//     res.status(201).json({ message: 'Order created successfully', order });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to create order' });
//   }
// };

// // Get all orders
// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find();
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch orders' });
//   }
// };

// // Get order by ID
// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch order' });
//   }
// };

// // Update order status
// exports.updateOrderStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to update order status' });
//   }
// };

// // Delete order
// exports.deleteOrder = async (req, res) => {
//   try {
//     const order = await Order.findByIdAndDelete(req.params.id);
//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }
//     res.json({ message: 'Order deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to delete order' });
//   }
// };

// // models/course.js

// const mongoose = require('mongoose');

// const courseSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   instructor: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   }
// });

// const Course = mongoose.model('Course', courseSchema);

// module.exports = Course;

// // controllers/courseController.js

// const Course = require('../models/course');

// // Controller actions

// // Get all courses
// exports.getAllCourses = async (req, res) => {
//   try {
//     const courses = await Course.find();
//     res.json(courses);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get a specific course by ID
// exports.getCourseById = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }
//     res.json(course);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Create a new course
// exports.createCourse = async (req, res) => {
//   const course = new Course({
//     title: req.body.title,
//     instructor: req.body.instructor,
//     price: req.body.price,
//     description: req.body.description
//   });

//   try {
//     const newCourse = await course.save();
//     res.status(201).json(newCourse);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // Update a course
// exports.updateCourse = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     course.title = req.body.title || course.title;
//     course.instructor = req.body.instructor || course.instructor;
//     course.price = req.body.price || course.price;
//     course.description = req.body.description || course.description;

//     const updatedCourse = await course.save();
//     res.json(updatedCourse);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // Delete a course
// exports.deleteCourse = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     await course.remove();
//     res.json({ message: 'Course deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const mongoose = require('mongoose');

// const SingleOrderItemSchema = mongoose.Schema({
//   name: { type: String, required: true },
//   image: { type: String, required: true },
//   price: { type: Number, required: true },
//   amount: { type: Number, required: true },
//   product: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'Product',
//     required: true,
//   },
// });

// const OrderSchema = mongoose.Schema(
//   {
//     tax: {
//       type: Number,
//       required: true,
//     },
//     shippingFee: {
//       type: Number,
//       required: true,
//     },
//     subtotal: {
//       type: Number,
//       required: true,
//     },
//     total: {
//       type: Number,
//       required: true,
//     },
//     orderItems: [SingleOrderItemSchema],
//     status: {
//       type: String,
//       enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
//       default: 'pending',
//     },
//     user: {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     clientSecret: {
//       type: String,
//       required: true,
//     },
//     paymentIntentId: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Order', OrderSchema);

// const Order = require('../models/Order');
// const Product = require('../models/Product');

// const { StatusCodes } = require('http-status-codes');
// const CustomError = require('../errors');
// const { checkPermissions } = require('../utils');

// const fakeStripeAPI = async ({ amount, currency }) => {
//   const client_secret = 'someRandomValue';
//   return { client_secret, amount };
// };

// const createOrder = async (req, res) => {
//   const { items: cartItems, tax, shippingFee } = req.body;

//   if (!cartItems || cartItems.length < 1) {
//     throw new CustomError.BadRequestError('No cart items provided');
//   }
//   if (!tax || !shippingFee) {
//     throw new CustomError.BadRequestError(
//       'Please provide tax and shipping fee'
//     );
//   }

//   let orderItems = [];
//   let subtotal = 0;

//   for (const item of cartItems) {
//     const dbProduct = await Product.findOne({ _id: item.product });
//     if (!dbProduct) {
//       throw new CustomError.NotFoundError(
//         `No product with id : ${item.product}`
//       );
//     }
//     const { name, price, image, _id } = dbProduct;
//     const singleOrderItem = {
//       amount: item.amount,
//       name,
//       price,
//       image,
//       product: _id,
//     };
//     // add item to order
//     orderItems = [...orderItems, singleOrderItem];
//     // calculate subtotal
//     subtotal += item.amount * price;
//   }
//   // calculate total
//   const total = tax + shippingFee + subtotal;
//   // get client secret
//   const paymentIntent = await fakeStripeAPI({
//     amount: total,
//     currency: 'usd',
//   });

//   const order = await Order.create({
//     orderItems,
//     total,
//     subtotal,
//     tax,
//     shippingFee,
//     clientSecret: paymentIntent.client_secret,
//     user: req.user.userId,
//   });

//   res
//     .status(StatusCodes.CREATED)
//     .json({ order, clientSecret: order.clientSecret });
// };
// const getAllOrders = async (req, res) => {
//   const orders = await Order.find({});
//   res.status(StatusCodes.OK).json({ orders, count: orders.length });
// };
// const getSingleOrder = async (req, res) => {
//   const { id: orderId } = req.params;
//   const order = await Order.findOne({ _id: orderId });
//   if (!order) {
//     throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
//   }
//   checkPermissions(req.user, order.user);
//   res.status(StatusCodes.OK).json({ order });
// };
// const getCurrentUserOrders = async (req, res) => {
//   const orders = await Order.find({ user: req.user.userId });
//   res.status(StatusCodes.OK).json({ orders, count: orders.length });
// };
// const updateOrder = async (req, res) => {
//   const { id: orderId } = req.params;
//   const { paymentIntentId } = req.body;

//   const order = await Order.findOne({ _id: orderId });
//   if (!order) {
//     throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
//   }
//   checkPermissions(req.user, order.user);

//   order.paymentIntentId = paymentIntentId;
//   order.status = 'paid';
//   await order.save();

//   res.status(StatusCodes.OK).json({ order });
// };

// module.exports = {
//   getAllOrders,
//   getSingleOrder,
//   getCurrentUserOrders,
//   createOrder,
//   updateOrder,
// };