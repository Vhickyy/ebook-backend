import BookModel from "../book/BookModel.js";
import CartModel from "../cart/CartModel.js";
import OrderModel from "./OrderModel.js";
import PaymentController from "../payment/PaymentController.js"
import LibraryModel from "../library/LibraryModel.js";

const paymentController = new PaymentController()

class OrderService {

    async createOrder (cartId) {
        let cart = await CartModel.findOne({_id:cartId}).populate("items").populate("user");
        if(!cart)return false;
        const {total} = cart;
        const {fullname,email} = cart.user;
        const {data} = await paymentController.initializePayment({amount:total,email,name:fullname});
        const {_id,...cartData} = cart.toJSON();
        // console.log(cartData);
        await OrderModel.create({...cartData,paymentReference: data.reference});
        return data;
    }

    async verifyOrder (reference,user,res) {
        const verifyPayment = await paymentController.verifyPayment(reference);
        const order = await OrderModel.findOne({user,paymentReference:reference});
        // const cart = await CartModel.findOne({user});
        console.log({order});
        if(!order) return false;
        if(order.status != "pending"){
            res.status(400);
            throw new Error("Orders has already been attempted for these items.")
        }
        console.log({verifyPayment});
        if(verifyPayment.data.status == "success"){
            order.status = "purchased";
            await order.save();
            console.log("verifying");
            // const cart = await CartModel.findOne({user})
            order.items.map( async (item) => {
                await LibraryModel.create({user,book:item});
            })
            // const library = await LibraryModel.create()
            await CartModel.findOneAndDelete({user});
            console.log("done");
            return true;
        } else{
            order.status = "failed";
            await order.save();
            // await OrderModel.findOneAndUpdate({user,paymentReference:reference},{status:"failed"},{new:true});
            console.log("error");
            return false
        }
    }

    async getAllOrdersForUser (user) {
        const orders = await OrderModel.find({user});
        return orders;
    }

    async getOrder (_id,res) {
        const order = await OrderModel.findById({_id});
        if(!order){
            res.status(404);
            throw new Error('No')
        }
        return order;
    }

    async updateOrder () {

    }

    // for admin
    async deleteOrder () {

    }
}

export default OrderService;