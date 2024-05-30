import mongoose from "mongoose";
import CartService from "./CartService.js";

const cartService = new CartService();

class CartController {

    async createCart (req,res) {
        // console.log(req.body.id);
        if(!req.body.id || !mongoose.isValidObjectId(req.body.id)) return res.status(400).json({success:false,message:"Provide a valid book id"});
        const cart = await cartService.createCart({user:req.user.userId,book:req.body.id},res);
        // console.log({cart});
        return res.status(201).json({success:true,message:"Item added to cart",data:cart});
    }


    async getCart (req,res) {
        const cart = await cartService.getCart(req.user.userId);
        return res.status(200).json({success:true,message:"Cart Sent Successfully", data:cart});
    }


    async removeCartItem (req,res) {
        const cart = await cartService.removeCartItem(req.user.userId,req.params.id);
        if(!cart) return res.status(404).json({status:false,message:"No item in cart with this id"});
        return res.status(200).json({success:true,message:'Item Deleted Successfully',data:cart})
    }


    async clearCart (req,res) {
        const cart = await cartService.clearCart(req.params.id);
        if(!cart){
            res.status(404);
            throw new Error("No such cart present!")
        }
        return res.status(200).json({success:true,message:"Cart Deleted Successfully"});
    }
    
}

export default CartController


// async increaseItem (req,res) {
//     const cart = await cartService.increaseItem(req);
//     return res.status(200).json({success:true,message:"Cart updated Successfully", data:cart});
// }


// async decreaseItem (req,res) {
//     const cart = await cartService.decreaseItem(req);
//     return res.status(200).json({success:true,message:"Cart updated Successfully", data:cart});
// }



// // controllers/CartController.js
// const Cart = require('../models/Cart');

// exports.getCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user._id }).populate('items.book');
//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.addToCart = async (req, res) => {
//   try {
//     const { bookId, quantity } = req.body;
//     let cart = await Cart.findOne({ user: req.user._id });

//     if (!cart) {
//       cart = await Cart.create({ user: req.user._id, items: [] });
//     }

//     const index = cart.items.findIndex(item => item.book.toString() === bookId);
//     if (index !== -1) {
//       cart.items[index].quantity += quantity;
//     } else {
//       cart.items.push({ book: bookId, quantity });
//     }

//     await cart.save();
//     res.status(201).json(cart);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// exports.removeFromCart = async (req, res) => {
//   try {
//     const { bookId } = req.params;
//     const cart = await Cart.findOne({ user: req.user._id });

//     cart.items = cart.items.filter(item => item.book.toString() !== bookId);

//     await cart.save();
//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.clearCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user._id });

//     cart.items = [];

//     await cart.save();
//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // controllers/orderController.js
// const Order = require('../models/Order');
// const Cart = require('../models/Cart');

// exports.createOrder = async (req, res) => {
//   try {
//     const { items, totalAmount, paymentMethod, shippingAddress } = req.body;
//     const order = await Order.create({
//       user: req.user._id,
//       items,
//       totalAmount,
//       paymentMethod,
//       shippingAddress
//     });

//     // Clear the cart after creating the order
//     await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });

//     res.status(201).json(order);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// exports.getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id });
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
