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
// });

const AnonymousCartSchema = mongoose.Schema({
    uuid: {
        type: String,
        required: true
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
    },
    removedAt:{
        type: Date
    }
},{timestamps:true});

const AnonymousCartModel = mongoose.model("AnonymousCart",AnonymousCartSchema);

export default AnonymousCartModel;