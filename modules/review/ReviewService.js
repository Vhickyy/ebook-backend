import BookModel from "../book/BookModel.js";
import ReviewModel from "./ReviewModel.js";

class ReviewService {

    async postReview (data,res) {
        const book = await BookModel.findOne({_id:data.bookId});
        if(!book){
            res.status(404);
            throw new Error("The requested book does not exist")
        }
        if(book.author.toString() == data.reviewer){
            res.status(400);
            throw new Error("You cannot review your book")
        }
        const reviewedByUser = await ReviewModel.findOne({_id:data.bookId,user:data.reviewer});
        if(reviewedByUser){
            res.status(400);
            throw new Error("You have already reviewed this book.")
        }
        const review = await ReviewModel.create(data);
        return review;
    }


    // async getAllReviews () {
    //     // admin route
    //     const reviews = await ReviewModel.find({});
    //     return reviews;
    // }

   

    // async getReview (reviewId,res) {
    //     const review = await ReviewModel.findById({_id:reviewId});
    //     if(!review){
    //         res.status(404);
    //         throw new Error("Route not found!!");
    //     }
    //     return review;
    // }

    // async getAllReviewByUser (userId,res) {
    //     const reviews = await ReviewModel.find({author:userId});
    //     if(!reviews){
    //         res.status(404);
    //         throw new Error("Route not found!!");
    //     }
    //     return reviews;
    // }

    async updateReview (data,res) {
        console.log(data);
        const {id,reviewer,...updateData} = data;
        console.log(id,reviewer,updateData);
        const review = await ReviewModel.findOneAndUpdate({_id:id,reviewer},updateData,{new:true});
        console.log(review);
        if(!review){
            res.status(404);
            throw new Error("The requested book does not exist");
        }
        return review;
    }

    async deleteReview (data,res) {
        const review = await ReviewModel.findOneAndDelete({_id:data.id,reviewer:data.reviewer});
        if(!review){
            res.status(404);
            throw new Error("The requested book does not exist")
        }
        return review;
    }

}

export default ReviewService