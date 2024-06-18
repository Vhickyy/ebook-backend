
import LibraryModel from "./LibraryModel.js";

class LibraryService {

    // async createLibrary () {

    // }

    async getLibrary (user) {
        // const library = await LibraryModel.find({user}).populate("book",{select:"author frontCover title"});
        const library = await LibraryModel.find({user}).populate({
            path: 'book',
            select: 'title frontCover', 
            populate: {
            path: 'author',
            //   model: 'User',
            select: 'fullname' 
            }
        });;
        if(!library) return false;
        return library;
    }

    async addRecentlyOpened () {

    }

    async getPdf(_id,user){
        const book = await LibraryModel.findOne({_id,user}).populate({path:"book",select:'pdf title'});
        console.log(book);
        if(!book) return false;
        return book;
    }

}

export default LibraryService;