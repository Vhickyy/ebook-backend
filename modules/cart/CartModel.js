import mongoose from "mongoose";

// const CartItems = mongoose.Schema({
//     book: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Book',
//         required: true
//     },
//     // quantity: {
//     //     type: Number,
//     //     default: 1
//     // }
// })

const CartSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    items: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Book"
    },
    // items: {
    //     type: [CartItems]
    // },
    orderValue:{
        type: Number,
        default: 0
    },
    total:{
        type: Number,
        default: 0
    },
    discount:{
        type: Number,
        default: 0
    }
},{timestamps:true})

const CartModel = mongoose.model("Cart",CartSchema);

export default CartModel;









// // models/Order.js
// const mongoose = require('mongoose');

// const OrderItemSchema = new mongoose.Schema({
//   book: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Book',
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   }
// });

// const OrderSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   items: [OrderItemSchema],
//   totalAmount: {
//     type: Number,
//     required: true
//   },
//   paymentMethod: {
//     type: String,
//     required: true
//   },
//   shippingAddress: {
//     type: String,
//     required: true
//   },
//   orderDate: {
//     type: Date,
//     default: Date.now
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'],
//     default: 'Pending'
//   }
// });

// module.exports = mongoose.model('Order', OrderSchema);
