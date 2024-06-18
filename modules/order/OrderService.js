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
            
            // await OrderModel.create({user:user,items:[bookId],orderValue:book.price,total:book.price,discount:book.discount,paymentReference: data.reference});
            await OrderModel.create({user:user,book:bookId,orderValue:book.price,total:book.price,discount:book.discount,paymentReference: data.reference});
            
            return data;
        }
        // console.log("ss");
        let cart = await CartModel.findById({_id:cartId}).populate("items").populate("user");
        if(!cart)return false;
        const {total} = cart;
        const {fullname,email} = cart.user;
        const {data} = await paymentController.initializePayment({amount:total,email,name:fullname});
        const {_id,...cartData} = cart.toJSON();

        for (const book of cart.items) {
            await OrderModel.create({
                user: cart.user._id,
                book: book._id,
                orderValue: book.price,
                total: book.price,
                discount: book.discount,
                paymentReference: data.reference,
            });
        }
        // await OrderModel.create({...cartData,paymentReference: data.reference});
        return data;

    }

    async verifyOrder (reference,user,res) {
        const verifyPayment = await paymentController.verifyPayment(reference);
        const orders = await OrderModel.find({user,paymentReference:reference});
        if(!orders) return false;
        
        if(orders[0].status != "pending"){
            res.status(400);
            throw new Error("Orders has already been attempted for these items.")
        }
        
        if(verifyPayment.data.status == "success"){
            for (const order of orders) {
                order.status = "purchased";
                await order.save();
            }
            const updateBookPromises = orders.map(item => {
                return BookModel.findByIdAndUpdate({_id:item.book}, { $inc: { sold: 1 } }, { new: true })
            }
            );

            const createLibraryPromises = orders.map(item =>
                LibraryModel.create([{ user, book: item.book }])
            );

            await Promise.all([...updateBookPromises, ...createLibraryPromises]);
            console.log({orders});
            if(orders.length == 1){
                const cart = await CartModel.findOneAndUpdate(
                    { user },
                    { $pull: { items: orders[0].book }, $inc: { total: -orders[0].total, orderValue: -orders[0].orderValue } },
                    { new: true }
                );
                // console.log({cart});
                if(!cart.items.length) {
                    await cart.deleteOne();
                }
            } else{
                await CartModel.findOneAndDelete({user});
            }
            return true;

        } else{
            for (const order of orders) {
                order.status = "failed";
                await order.save();
            }
            return false;
        }
    }

    async getAllOrdersForUser (user) {
        const orders = await OrderModel.find({user}).populate({
            path: 'book',
            select: 'title frontCover', 
        });
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