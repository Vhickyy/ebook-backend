import { populate } from "dotenv";
import BookModel from "../book/BookModel.js";
import CartModel from "./CartModel.js";
import LibraryModel from "../library/LibraryModel.js";

class CartService {
    
    async createCart ({user,book},res) {
        const isAuthor = await BookModel.findOne({_id:book});
        if(!isAuthor){
            res.status(404);
            throw new Error ("No book with this Id.")
        }
        if(isAuthor.author.toString() == user){
            res.status(400);
            throw new Error ("You can't purchase your book.")
        };
        // check if user has bought the book before adding to cart
        const boughtByUser = await LibraryModel.findOne({user,book}) ;
        if(boughtByUser){
            res.status(400);
            throw new Error("You have bought this book.")
        }
        const cart = await CartModel.findOne({user});
        const {price,discount,discountPrice} = isAuthor;
        if(!cart){
            let cartItem = await CartModel.create({user,items:[book],orderValue:price,total:discountPrice,discount});
            await cartItem.populate({path:"items",populate:{path:"author frontCover"}})
            return cartItem;
        }

        const itemInCart = cart.items.find(item => item.toString() == book);
        if(itemInCart){
            res.status(400);
            throw new Error("Item already in cart.");
        }

        cart.items.push(book);
        cart.orderValue += price;
        cart.discount += discount;
        cart.total += discountPrice;
        await cart.save();
        await cart.populate({path:"items",populate:{path:"author frontCover"}});
        console.log(cart);
        return cart;
    }


    async getCart(user) {
        // pending: think if cart can be gotten by the id after login
        // let cart = await CartModel.findOne({user}).populate("items");
        let cart = await CartModel.findOne({user}).populate({path:"items",select: "title price discountPrice discount",populate:{path:"author frontCover"}});
        // // console.log("ji");
        // cart = await BookModel.populate(cart,{path: "items.book",select:"price discountPrice discount"});
        // console.log(cart);
        return cart
    }


    async removeCartItem (user,book) {
        const cart = await CartModel.findOne({user}).populate("items");
        const filteredItem = cart.items.filter(item => item._id.toString() != book);
        const deletedItem = cart.items.find(item => item._id.toString() == book);
        cart.items = filteredItem;
        if(!deletedItem)return false;
        cart.orderValue -= deletedItem.price;
        cart.discount -= deletedItem.discount;
        cart.total -= deletedItem.discountPrice;
        if(!filteredItem.length){
            await cart.deleteOne();
            return cart;
        }
        await cart.save();
        await cart.populate({path:"items",populate:{path:"author frontCover"}});
        console.log({cart});
        // await cart.populate("items");
        return cart;
    }


    async clearCart (_id) {
        const cart = await CartModel.findByIdAndRemove({_id});
        return {success:true,message:'Cart Cleared Successfully'}
    }

    
}

export default CartService;


// important code for e commerce

// async increaseItem (req){
//     let cart = await CartModel.findOne({user:req.user.userId}).populate("items");
//     cart = await BookModel.populate(cart,{path: "items.book",select:"price discountPrice discount"})
//     let indexItem = 0;
//     const itemInCart = cart.items.filter((item,index) => {
//         indexItem = index;
//         return item.book._id == req.params.id
//     });
//     if(itemInCart.length){
//         const {price,discount,id,discountPrice} = itemInCart[0].book;
//         ++itemInCart[0].quantity;
//         cart.items[indexItem] = itemInCart[0];
//         cart.orderValue = price * itemInCart[0].quantity;
//         // calculate discount
//         cart.totalDiscount = discount;
//         cart.total = discountPrice * itemInCart[0].quantity;
//         await cart.save();
//     }
//     return cart;
// }



// async decreaseItem (req) {
//     let cart = await CartModel.findOne({user:req.user.userId}).populate("items");
//     cart = await BookModel.populate(cart,{path: "items.book",select:"price discountPrice discount"});
//     // console.log(cart);
//     let indexItem = 0;
//     const itemInCart = cart.items.filter((item,index) => {
//         indexItem = index;
//         return item.book.id == req.params.id
//     });
//     console.log(itemInCart);
//     const {price,discount,discountPrice} = itemInCart[0]?.book;
//     if(itemInCart[0].quantity >= 1){
//         itemInCart[0].quantity--
//         cart.items[indexItem] = itemInCart[0];
//     }
//     if(itemInCart[0].quantity < 1){
//         // cart.items.splice(indexItem,1);
//         await cart.deleteOne();
//         return [];
//     }
//     cart.orderValue -= price ;
//     // // calculate discount
//     cart.totalDiscount = discount;
//     cart.total -= discountPrice;
//     await cart.save();
//     // return res.status(201).json({msg:"cart updated successfully second",cartItem})
//     return cart;
// }