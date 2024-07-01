import { errorHandler, notFoundHandler } from "./middleware/notFound_ErrorMiddleware.js";
import AuthRouter from "./modules/auth/AuthRoute.js";
import BookRouter from "./modules/book/BookRoute.js";
import CartRouter from "./modules/cart/CartRoute.js";
import OrderRouter from "./modules/order/OrderRoute.js";
import ReviewRouter from "./modules/review/ReviewRoute.js";
import AnnonymousRouter from "./modules/anonymousCart/AnonymousCartRoute.js";
import WishlistRouter from "./modules/Wishlist/WishlistRoute.js";
import PaymentRouter from "./modules/payment/PaymentRouter.js";
import LibraryRouter from "./modules/library/LibraryRoute.js";

const appConfig = (app) => {


    // test
    // <Move to seperate router file
    app.get("/",async (req,res)=>{
        res.status(200).json({msg:"Welcome to warm-books"});
    })

    app.use("/api/v1/auth",AuthRouter);
    app.use("/api/v1/books",BookRouter);
    app.use("/api/v1/cart",CartRouter);
    app.use("/api/v1/annonymous-cart",AnnonymousRouter);
    app.use("/api/v1/wishlist",WishlistRouter);
    app.use("/api/v1/order",OrderRouter);
    app.use("/api/v1/review",ReviewRouter);
    app.use("/api/v1/payment",PaymentRouter);
    app.use("/api/v1/library",LibraryRouter);
    
    // Not_Found and Error
    app.use("*",notFoundHandler)
        .use(errorHandler);

}

export default appConfig;