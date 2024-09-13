import mongoose from "mongoose";

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
