import mongoose from "mongoose";
import ReviewService from "./ReviewService.js"

const reviewService = new ReviewService();

class ReviewController {

    async postReview (req,res) {
        const id = req.params.id;
        // console.log(req.body,{id});
        if(!id || !mongoose.isValidObjectId(id)) return res.status(400).json({success:false,message:"Provide a valid book Id"});
        if(!req.body.review || !req.body.rating) return res.status(400).json({success:false,message:"Review and rating are required"});
        req.body.reviewer = req.user.userId;
        const review = await reviewService.postReview(req.body,id,res);
        return res.status(201).json({success:true,message:"Review Created Successfully", data:review});
    }

    // async getAllReview (req,res) {
    //     // admin route
    //     const reviews = await reviewService.getAllReview(req.body,res);
    //     return res.status(200).json({success:true,message:"Reviews Sent Successfully", data:reviews});
    // }

    // async getReview(req,res) {
    //     const review = await reviewService.getReview(req.params.id,res);
    //     return res.status(200).json({success:true,message:"Reviews Sent Successfully", data:review});
    // }
    
    // async getAllReviewByUser (req,res){
    //     const reviews = await reviewService.getAllReviewByUser();
    //     return res.status(200).json({success:true,message:"Reviews Sent Successfully", data:reviews})
    // }

    async updateReview (req,res) {
        req.body.id = req.params.id;
        req.body.reviewer = req.user.userId;
        const review = await reviewService.updateReview(req.body,res);
        return res.status(200).json({success:true,message:"Review updated Successfully", data:review});
    }

    async deleteReview (req,res) {
        req.body.id = req.params.id;
        req.body.reviewer = req.user.userId;
        const review = await reviewService.deleteReview(req.body,res);
        return res.status(200).json({success:true,message:"Review deleted Successfully"})
    }

}

export default ReviewController;