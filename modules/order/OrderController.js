import mongoose from "mongoose";
import OrderService from "./OrderService.js"

const orderService = new OrderService;

class OrderController {

    async createOrder (req,res) {
        // console.log("uuyguy");
        if(!req.body.cartId || !mongoose.isValidObjectId(req.body.cartId)) return res.status(400).json({success:false,message:"Provide a valid id"})
        const order = await orderService.createOrder(req.body.cartId,req.user.userId);
        if(!order) return res.status(400).json({success:false,message:"Cart Id not found"})
        return res.status(200).json({msg:"order created",order})
    }

    async verifyOrder (req,res) {
        console.log({ref:req.params.reference});
        const user = req.user.userId;
        const verified = await orderService.verifyOrder(req.params.reference,user,res);
        if(!verified) return res.status(402).json({success:false,message:"Payment not successful!"});
        return res.status(200).json({success:true,message:"Purchase Successful"})
    }

    async getAllOrdersForUser (req,res){
        const orders = await orderService.getAllOrdersForUser(req.user.userId);
        return res.status(200).json({msg:"orders sent"})
    }
}

export default OrderController;