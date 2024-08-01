import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema({
    review: {
        type:String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    bookId: {
        type: mongoose.Types.ObjectId,
        ref: "Book"
    },
    reviewer:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps:true
});

ReviewSchema.index({ bookId: 1, reviewer: 1 }, { unique: true });
ReviewSchema.index({ bookId: 1 });

ReviewSchema.statics.averageRating = async function (bookId) {
    const result = await this.aggregate([
      { $match: { bookId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          numberOfReviews: { $sum: 1 },
        },
      },
    ]);
  console.log(result);
    try {
      await this.model('Book').findOneAndUpdate(
        { _id: bookId },
        {
          averageRating: Math.ceil(result[0]?.averageRating || 0),
          numberOfReviews: result[0]?.numberOfReviews || 0,
        }
      );
    } catch (error) {
      throw new Error("Internal Server Error");
    }
};
  
ReviewSchema.post('save', async function () {
    await this.constructor.averageRating(this.bookId);
});
  
ReviewSchema.post('remove', async function () {
    await this.constructor.averageRating(this.bookId);
});

const ReviewModel = mongoose.model("Review",ReviewSchema);

export default ReviewModel;