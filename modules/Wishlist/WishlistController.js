import WishlistService from "./WishlistService.js";

const wishlistService = new WishlistService();

class WishlistController {

    async createWishlist(req,res){
        const wishlist = await wishlistService.createWishlist({user:req.user.userId,book:req.body.book},res);
        // console.log({wishlist});
        return res.status(201).json({success:true,message:"Wishlist Created Successfully",data:wishlist});
        return res.status(400).json({success:false,message:"failed to add to wishlist"});
    }


    async getWishlist (req,res) {
        const wishlist = await wishlistService.getWishlist(req.user.userId);
        return res.status(200).json({success:true,message:"Wishlist Sent Successfully", data:wishlist});
    }


    async removeWishlistItem (req,res) {
        const wishlist = await wishlistService.removeWishlistItem(req.user.userId,req.params.id);
        if(!wishlist) return res.status(400).json({success:false,message:"Error removing item from wishlist."})
        return res.status(200).json({success:true,message:'Item Deleted Successfully'})
    }


    async clearWishlist (req,res){
        const wishlist = await wishlistService.clearWishlist(req.user.userId);
        if(!wishlist){
            res.status(404);
            throw new Error("No such wishlist present!")
        }
        return res.status(200).json({success:true,message:"Wishlist Deleted Successfully"});
    }
    
}

export default WishlistController

