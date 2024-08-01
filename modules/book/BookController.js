import BookService from "./BookService.js";

const bookService = new BookService();

class BookController {

    async createBook (req,res){
        if(req.user.role != "author"){
            res.status(403);
            throw new Error("You must be an author to perform this action");
        }
        req.body.author = req.user.userId;
        const book = await bookService.createBook(req,res);
        return res.status(201).json({success: true,message:"Book added Successfully", data: book});
    }

    async getAllBooks (req,res){
        const {books,pageSize} = await bookService.getAllBooks(req);
        return res.status(200).json({success: true,message:"Books sent successfully", data: {books,length:books.length,pageSize:pageSize}})
    }

    async getAllAuthorBooks (req,res){
        // console.log(req.body.id);
        const books = await bookService.getAllAuthorBooks(req.params.id);
        console.log(books);
        return res.status(200).json({success: true,message:"Books sent successfully", data: {books}})
    }

    async getBook (req,res){
       const {id} = req.params;
       if(!id){
        return res.status(404).json({success: false, message: "Provide valid id"})
       }
        const book = await bookService.getBook(req);
        if(!book){
            return res.status(404).json({success: false, message: "No such book"})
        }
        return res.status(200).json({success: true,message:"Book sent successfully", data: book})
    }

    async updateBook (req,res) {
        console.log("herrr");
        const book = await bookService.updateBook(req,res);
        return res.status(200).json({success: true,message:"Book updated Successfully", data: book});
    }

    async deleteBook (req,res) {
        const book = await bookService.deleteBook(req.params.id,req.user.userId,res);
        if(!book) return res.status(404).json({success:false,message:"Book Not Found"})
        return res.status(200).json({success: true,message:"Book deleted Successfully", data: null});
    }

}

export default BookController