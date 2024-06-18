import mongoose from "mongoose";

// const OrderItemSchema = new mongoose.Schema({
//   book: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Book',
//     // required: true
//   },
//   name:{
//     type: String
//   },
//   price: {
//     type: Number,
//     // required: true
//   },
//   discount:{
//     type: Number,
//   },
//   quantity:{
//     type: Number,
//     default: 1
//   }
// });


const OrderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // items: {
    //   type: [mongoose.Schema.Types.ObjectId],
    //   ref: "Book"
    // },
    book:{
      type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },
    orderValue:{
      type: Number
    },
    total: {
        type: Number,
        required: true
    },
    discount:{
      type: Number
    },
    status: {
      type: String,
      enum: ['pending','purchased', 'refunded',"failed"],
      default: 'pending',
    },
    paymentReference: {
      type :String
    },
    orderDate: {
        type: Date,
        default: Date.now()
    }
},{
    timestamps:true
})


const OrderModel = mongoose.model("Order",OrderSchema);

export default OrderModel;






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