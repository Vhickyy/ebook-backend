import AnonymousCartService from "./AnonymousCartService.js";

const anonymousCartService = new AnonymousCartService();

class AnonymousCartController {

    async createCart (req,res) {
        const cart = await anonymousCartService.createCart({uuid:req.body.uuid,book:req.body.book},res);
        // console.log({anon:cart});
        return res.status(201).json({success:true,message:"Item added successfully",data:cart});
    }


    async getCart (req,res) {
        const cart = await anonymousCartService.getCart(req.params.id);
        if(!cart) return res.status(200).json({success:false,data:{cart:[],length:0}})
        return res.status(200).json({success:true,message:"Cart Sent Successfully", data:{cart,length:cart.items.length} });
    }


    async removeCartItem (req,res) {
        const cart = await anonymousCartService.removeCartItem(req.body.uuid,req.params.id);
        if(!cart) return res.status(404).json({success:false,message:"No item in cart with this id"});
        return res.status(200).json({success:true,message:'Item Deleted Successfully',data:cart})
    }


    async clearCart (req,res) {
        const cart = await anonymousCartService.clearCart(req.params.id);
        if(!cart){
            res.status(404);
            throw new Error("No such cart present!")
        }
        return res.status(200).json({success:true,message:"Cart Deleted Successfully"});
    }
    
}

export default AnonymousCartController;


// async increaseItem (req,res) {
//     const cart = await cartService.increaseItem(req);
//     return res.status(200).json({success:true,message:"Cart updated Successfully", data:cart});
// }


// async decreaseItem (req,res) {
//     const cart = await cartService.decreaseItem(req);
//     return res.status(200).json({success:true,message:"Cart updated Successfully", data:cart});
// }