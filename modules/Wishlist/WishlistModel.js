import mongoose from "mongoose";

const WishlistSchema = mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: {
      type : [mongoose.Types.ObjectId],
      ref:"Book"
    }
  },{
    timestamps:true
  });
  
 const WishlistModel = mongoose.model('Wishlist', WishlistSchema);

 export default WishlistModel;