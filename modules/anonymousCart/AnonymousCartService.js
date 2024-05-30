import BookModel from "../book/BookModel.js";
import AnonymousCartModel from "./AnonymousCartModel.js";

class AnonymousCartService {
    
    async createCart ({uuid,book},res) {
        const bookExist = await BookModel.findOne({_id:book});
        if(!bookExist){
            res.status(404);
            throw new Error ("No book with this Id.")
        }
        const cart = await AnonymousCartModel.findOne({uuid});
        const {price,discount,discountPrice} = bookExist;
        if(!cart){
            const cartItem = await AnonymousCartModel.create({uuid,items:[book],removedAt:Date.now(),orderValue:price,total:discountPrice,discount});
            await cartItem.populate({path:"items",populate:{path:"author frontCover"}})
            return cartItem;
        }
        const ItemInCart = cart.items.find(item => {
            return item.toString() == book
        });
        if(ItemInCart){
            res.status(400);
            throw new Error("Item already in cart.")
        }
        cart.removedAt = Date.now();
        cart.items.push(book);
        cart.orderValue += price;
        cart.discount += discount;
        cart.total += discountPrice;
        await cart.save();
        await cartItem.populate({path:"items",populate:{path:"author frontCover"}})
        return cart;
    }


    async getCart(uuid) {
        let cart = await AnonymousCartModel.findOne({uuid}).populate("items");
        // check if cart.removeAt is greater than 1day, if so, delete cart
        cart = await BookModel.populate(cart,{path: "items.book",select:"price discountPrice discount"});
        return cart
        // console.log("here",{cart});
        // if(cart){
        //     const {orderValue,totalDiscount,total} = cart.items.reduce((acc,item) => {
        //         acc.orderValue += item.price;
        //         acc.total += item.salePrice;
        //         acc.totalDiscount = 0;
        //         return acc;
        //     },{orderValue:0,totalDiscount:0,total:0});
        //     cart.orderValue = orderValue;
        //     cart.totalDiscount = totalDiscount;
        //     cart.total = total;
        //     await cart.save();
        //     return cart;
        // }
        // return false;
    }

    async removeCartItem (uuid,book) {
        const cart = await AnonymousCartModel.findOne({uuid}).populate("items");
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
        await cart.populate("items");
        // console.log({cart});
        return cart;
    }


    async clearCart (_id) {
        const cart = await AnonymousCartModel.findByIdAndRemove({_id});
        return {success:true,message:'Cart Cleared Successfully'}
    }

    
}

export default AnonymousCartService;


// async increaseItem (req){
//     const cart = await CartModel.findOne({uuid:req.body.uuid});
//     let indexItem = 0;
//     const itemInCart = cart.items.filter((item,index) => {
//         indexItem = index;
//         item.productId == req.params.id
//     });
//     if(itemInCart.length){
//         ++itemInCart[0].quantity;
//         // itemInCart[0].salePrice = itemInCart[0].price - ((discount/100) * itemInCart[0].price);
//         cart.items[index] = itemInCart[0];
//         cart.orderValue += itemInCart[0].price;;
//         // calculate discount
//         cart.totalDiscount = 0;
//         cart.total += itemInCart[0].salePrice;
//         await cart.save();
//     }
//     return cart;
// }

// async decreaseItem (req) {
//     const cartItem = await CartModel.findOne({uuid:req.body.uuid});
//     if(cartItem.length == 1){
//         await cartItem.deleteOne();
//         // return res.status(200).json({msg:"cart updated successfully"})
//     }
//     let indexItem = 0;
//     const itemInCart = cartItem.items.filter((item,index) => {
//         indexItem = index;
//         return item.productId == req.params.id
//     });
//     if(itemInCart[0].quantity > 1){
//         --itemInCart[0].quantity
//         cart.items[index] = itemInCart[0];
//     }
//     if(itemInCart[0].quantity == 1){
//         cartItem.items.splice(indexItem,1);
//     }
//     cart.orderValue -= itemInCart[0].price;;
//     // calculate discount
//     cart.totalDiscount = 0;
//     cart.total -= itemInCart[0].salePrice;
//     await cartItem.save();
//     // return res.status(201).json({msg:"cart updated successfully second",cartItem})
//     return cartItem;
// }

// async getCart(uuid) {
//     const cart = await AnonymousCartModel.findOne({uuid}).populate(items.book);
//     // check if cart.removeAt is greater than 1day, if so, delete cart
//     console.log(cart);
//     console.log(cart);
//     const {orderValue,totalDiscount,total} = cart.items.reduce((acc,item) => {
//         acc.orderValue += item.price * item.quantity;
//         acc.total += item.salePrice * item.quantity;
//         acc.totalDiscount = 0
//         return acc;
//     },{orderValue:0,totalDiscount:0,total:0});
//     cart.orderValue = orderValue;
//     cart.totalDiscount = totalDiscount;
//     cart.total = total;
//     await cart.save();
//     return cart;
// }