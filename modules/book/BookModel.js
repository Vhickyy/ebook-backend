import mongoose from "mongoose";

const BookSchema = mongoose.Schema({
    title:{
        type: String,
        index: true
    },
    description:{
        type:String
    },
    author:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    price: {
        type: Number
    },
    discount:{
        type: Number,
        default: 0
    },
    discountPrice:{
        type:Number,
        default: 0
    },
    discountEnds:{
        type: Date,
        default: null
    },
    sold:{
        type: Number,
        default: 0
    },
    frontCover:{
        type: {
            secureUrl: String,
            publicUrl: String
        },
        required: true
    },
    backCover: {
        type: {
            secureUrl: String,
            publicUrl: String
        },
        required: true
    },
    pdf: {
        type: {
            secureUrl: String,
            publicUrl: String
        },
        required: true
    },
    pages: {
        type: Number
    },
    publisher:{
        type:String
    },
    dateOfPublication:{
        type: String
    },
    ISBN:{
        type: Number
    },
    keywords: {
        type: [String]
    },
    category:{
        type: String,
        enum: ["science","technology","health","religion","fiction","art","finance"],
        index: true
    },
    averageRating:{
        type: Number,
        default: 0
    },
    numberOfReviews:{
        type: Number,
        default: 0
    }
},{
    timestamps:true,
    toJSON: { virtuals: true }, toObject: { virtuals: true }
});

BookSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'bookId',
    justOne: false,
});

BookSchema.pre('remove', async function () {
    await this.model('Review').deleteMany({ bookId: this._id });
});

const BookModel = mongoose.model("Book",BookSchema);

export default BookModel;