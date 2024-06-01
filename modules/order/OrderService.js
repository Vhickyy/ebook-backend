import BookModel from "../book/BookModel.js";
import CartModel from "../cart/CartModel.js";
import OrderModel from "./OrderModel.js";
import PaymentController from "../payment/PaymentController.js"
import LibraryModel from "../library/LibraryModel.js";
import UserModel from "../auth/UserModel.js"

const paymentController = new PaymentController()

class OrderService {

    async createOrder ({cartId,user,bookId}) {
        console.log(cartId,bookId,user);
        if(bookId){
            const boughtByUser = await LibraryModel.findOne({user,book:bookId});
            if(boughtByUser) return false;
            let book = await BookModel.findById({_id:bookId});
            if(!book)return false;
            const {email,fullname} = await UserModel.findById({_id:user});
            const {data} = await paymentController.initializePayment({amount:book.price,email,name:fullname});
            
            await OrderModel.create({user:user,items:[bookId],orderValue:book.price,total:book.price,discount:book.discount,paymentReference: data.reference});
            
            return data;
        }
        // console.log("ss");
        let cart = await CartModel.findById({_id:cartId}).populate("items").populate("user");
        if(!cart)return false;
        const {total} = cart;
        const {fullname,email} = cart.user;
        const {data} = await paymentController.initializePayment({amount:total,email,name:fullname});
        const {_id,...cartData} = cart.toJSON();
        await OrderModel.create({...cartData,paymentReference: data.reference});
        return data;

    }

    async verifyOrder (reference,user,res) {
        const verifyPayment = await paymentController.verifyPayment(reference);
        const order = await OrderModel.findOne({user,paymentReference:reference});
        if(!order) return false;
        
        if(order.status != "pending"){
            res.status(400);
            throw new Error("Orders has already been attempted for these items.")
        }
        
        if(verifyPayment.data.status == "success"){
            order.status = "purchased";
            const save = order.save();
            const updateBookPromises = order.items.map(item => {
                return BookModel.findByIdAndUpdate(item, { $inc: { sold: 1 } }, { new: true })
            }
            );

            const createLibraryPromises = order.items.map(item =>
                LibraryModel.create([{ user, book: item }])
            );

            await Promise.all([...updateBookPromises, ...createLibraryPromises,save]);

            if(order.items.length == 1){
                const cart = await CartModel.findOneAndUpdate({user},{ $pull: { items: order.items[0] } },{new:true});
                if(!cart.items.length) await cart.remove();
            } else{
                await CartModel.findOneAndDelete({user});
            }
            return true;

        } else{
            order.status = "failed";
            await order.save();
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