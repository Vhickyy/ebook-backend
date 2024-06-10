import BookModel from "../book/BookModel.js";
import LibraryModel from "../library/LibraryModel.js";
import WishlistModel from "./WishlistModel.js";

class WishlistService {
    

    async createWishlist ({user,book},res) {
        const wishlist = await WishlistModel.findOne({user});
        if(!wishlist){
            await WishlistModel.create({user,items:[book]});
            const wishlistItem = await BookModel.findById({_id:book});
            // console.log({wishlistItem});
            return wishlistItem;
        }
        const ItemInWishlist = wishlist.items.find(item => item.toString() == book);
        if(ItemInWishlist){
            res.status(400)
            throw new Error("Item already in wishlist.")
        }
        wishlist.items.push(book);
        await wishlist.save();
        const wishlistItem = await BookModel.findById({_id:book});
        // console.log({wishlistItem});
        return wishlistItem;
    }


    async getWishlist (user) {
        let wishlist = await WishlistModel.findOne({ user });
        if(!wishlist) return null;

        // ------------------------ check to see if book has been deleted --------------------- //

        const newWishItems = await Promise.all(wishlist?.items.map(async (item) => {
            const book = await BookModel.findById(item._id);
            if (book) return item;
            return null;
        }));
        wishlist.items = newWishItems.filter(item => item !== null);

        await wishlist.populate({
            path: 'items',
            select: 'title price frontCover', 
            populate: {
            path: 'author',
            //   model: 'User',
            select: 'fullname' 
            }
        });

        //  ---------------------- Check if user has bought any book present in wishlist -------------------//

        const lib = (await LibraryModel.find({user})).map(item => {return item.book.toString()});
        const updatedItems = wishlist.items.map(item => {
            return lib.includes(item._id.toString()) ? { ...item._doc, inLib: true } : { ...item._doc, inLib: false };
        });
        wishlist = wishlist._doc;
        wishlist.items = updatedItems;
        return wishlist;
    }


    async removeWishlistItem(user,book){
        const wishlist = await WishlistModel.findOne({user});
        const filtered = wishlist.items.filter(item =>item.toString() !== book);
        wishlist.items = filtered;
        await wishlist.save();
        return true;
    }


    async clearWishlist(user){
        const wishlist = await WishlistModel.findOneAndRemove({user});
        return wishlist;

    }

    
}

export default WishlistService;