import WishlistModel from "../Wishlist/WishlistModel.js";
import UserModel from "../auth/UserModel.js";
import LibraryModel from "../library/LibraryModel.js";
import CartModel from "../cart/CartModel.js"
import BookModel from "./BookModel.js";
import cloudinay from "cloudinary"
import fs from "fs/promises"


class BookService {

    async createBook (req,res){
        const {pdf,frontCover,backCover} = req.files;
        if(!pdf || !frontCover || !backCover){
            res.status(400)
            throw new Error("Provide pdf and images for book.")
        }
        const pdfFile = pdf[0];
        const frontCoverImage = frontCover[0];
        const backCoverImage = backCover[0];
        // check if pdf is doc and the rest are images of specific size
        if(!pdfFile.mimetype.includes("image") || !frontCoverImage.mimetype.includes("image") || !backCoverImage.mimetype.includes("image")){
            res.status(400)
            throw new Error("Provide a front and back cover image for book.")
        }
        // console.log(pdfFile,frontCoverImage,backCoverImage);
        // upload to cloud and remove uploads file
        let resImg;
        let resPdf;
        try {
            // console.log(pdfFile.path);
            resPdf = await cloudinay.v2.uploader.upload(pdfFile.path,{folder:"pdf"});
            await fs.unlink(pdfFile.path)
            resImg = [frontCoverImage,backCoverImage].map( async item => {
                const {path} = item
                // await fs.unlink(path)
                return await cloudinay.v2.uploader.upload(path,{folder:"book-image"});
            })
        } catch (error) {
            // console.log(error);
            res.status(424);
            throw new Error("Error occurred while uploading files.")
        }
        const response = await Promise.all(resImg);
        let discountPrice = req.body.price;
        if(req.body.discount){
            discountPrice = req.body.price - ((req.body.discount/100) * req.body.price)
        }
        const newBook = {...req.body, pdf: {publicUrl: resPdf.public_id,secureUrl:resPdf.secure_url}, frontCover: {publicUrl: response[0].public_id, secureUrl: response[0].secure_url}, backCover:{publicUrl: response[1].public_id, secureUrl: response[1].secure_url}, discountPrice};
        const book = await BookModel.create(newBook);
        return book;
    }

    async getAllBooks (req){
        const {search,category,page} = req.query;
        const query = {};
        if(search){
            query.title = { $regex: search, $options: 'i' };
        }
        if(category && category !== "all"){
            query.category = category;
        }
        const currentPage = Number(page) || 1;
        const limit = 5;
        const skip = (currentPage - 1) * limit;
        // let books;
        // if(req?.user.role == "author"){
        //     books = await BookModel.find({author: {ne: req.user.userId}});
        // }
        // query = 
        // console.log(query);
        // console.log(req.user);
        let books;
        if(req?.user){
            const {role,userId} = req.user;
            if (role === "author") {
                query.author = { $ne: req.user.userId };
            }
            const wishlist = await WishlistModel.findOne({user:userId});
            // console.log({wishlist});
            // books = await BookModel.find(query).skip(skip).limit(limit);
            books = await BookModel.find(query).skip(skip).limit(limit).populate({ path: "author", select: "fullname" });
            const totalBooks = await BookModel.countDocuments(query);
            const pageSize = Math.ceil(totalBooks / limit);
            books = books.map((book,i) => wishlist.items.includes(book._id) ? {...book._doc,inWishlist:true} : {...book._doc,inWishlist:false});
            console.log(books);
            return {books,pageSize}
        }
        books = await BookModel.find(query).skip(skip).limit(limit).populate({ path: "author", select: "fullname" });
        // await books.populate({path:"author",select:"full name"})
        const totalBooks = await BookModel.countDocuments(query);
        const pageSize = Math.ceil(totalBooks / limit);
        return {books,pageSize};
    }

    async getAllAuthorBook () {
        if(req.user.role != "author")return false
        const books = await BookModel.find({author:req.user.userId});
        return books;
    }

    async getBook (req){
        // console.log(_id);
        let book = await BookModel.findById({_id:req.params.id}).populate("author").populate("reviews");
        // check if there is a user and if the book is in their library or cart then they should read and not buy it, if they started readin, they should continue reading.
        if(req?.user){
            const {userId} = req.user;
        //     if (role === "author") {
        //         query.author = { $ne: req.user.userId };
        //     }
        //     const wishlist = await WishlistModel.findOne({user:userId});
        //     // console.log({wishlist});
        //     // books = await BookModel.find(query).skip(skip).limit(limit);
        //     books = await BookModel.find(query).skip(skip).limit(limit);
        //     const totalBooks = await BookModel.countDocuments(query);
        //     const pageSize = Math.ceil(totalBooks / limit);
        //     books = books.map((book,i) => wishlist.items.includes(book._id) ? {...book._doc,inWishlist:true} : {...book._doc,inWishlist:false});
        //     return {books,pageSize}

        // find if in library first
            const library = await LibraryModel.findOne({user:userId,book:req.params.id});
            book = library ? {...book.toJSON(),bought:true} : {...book.toJSON(),bought:false};

            if(!library){
                const cart = await CartModel.findOne({user:userId,items:{$in: [req.params.id]}});
                book = cart ? {...book,inCart:true} : {...book,inCart:false};
            }

        }
        console.log(book);
        return book;
    }

    async updateBook (req,res) {
        const isAuthor = await BookModel.findOne({_id:req.params.id,author:req.user.userId});
        if(!isAuthor){
            res.status(404)
            throw new Error("Book not found")
        }
        const {frontCover,backCover} = req.files;
        if(!frontCover || !backCover){
            res.status(400)
            throw new Error("Provide images for book.")
        }
        const frontCoverImage = frontCover[0];
        const backCoverImage = backCover[0];
        // check if pdf is doc and the rest are images of specific size
        // check if pdf is doc and the rest are images of specific size
        if(!frontCoverImage.mimetype.includes("image") || !backCoverImage.mimetype.includes("image")){
            res.status(400)
            throw new Error("Provide a front and back cover image for book.")
        }
        // delete and upload to cloud and remove uploads file
        const updatedBook = {...req.body, frontCover: frontCoverImage.filename, backCover:backCoverImage.filename};
        const book = await BookModel.findOneAndUpdate({_id:req.params.id,author:req.user.userId},updatedBook,{new:true});
        return book;
    }

    async deleteBook (_id,author,res) {
        const book = await BookModel.findOne({_id,author});
        if(!book) return false
        await book.deleteOne();
        return true;
    }
    
}

export default BookService;