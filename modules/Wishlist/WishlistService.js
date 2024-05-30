import WishlistModel from "./WishlistModel.js";

class WishlistService {
    

    async createWishlist ({user,book},res) {
        const wishlist = await WishlistModel.findOne({user});
        if(!wishlist){
            const wishlistItem = await WishlistModel.create({user,items:[book]});
            return wishlistItem;
        }
        const ItemInWishlist = wishlist.items.find(item => item.toString() == book);
        if(ItemInWishlist){
            res.status(400)
            throw new Error("Item already in wishlist.")
        }
        wishlist.items.push(book);
        await wishlist.save();
        return wishlist;
    }


    async getWishlist (user) {
        const wishlist = await WishlistModel.findOne({user}).populate("items");
        return wishlist;
    }


    async removeWishlistItem(user,book){
        const wishlist = await WishlistModel.findOne({user});
        const filtered = wishlist.items.filter(item =>item.toString() !== book);
        wishlist.items = filtered;
        await wishlist.save();
        return wishlist;
    }


    async clearWishlist(user){
        const wishlist = await WishlistModel.findOneAndRemove({user});
        return wishlist;
        // return {success:true,message:'Cart Cleared Successfully'}
    }

    
}

export default WishlistService;