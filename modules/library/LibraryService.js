
import LibraryModel from "./LibraryModel.js";

class LibraryService {

    // async createLibrary () {

    // }

    async getLibrary (user) {
        const library = await LibraryModel.find({user}).populate("book");
        if(!library) return false;
        return library;
    }

    async addRecentlyOpened () {

    }

}

export default LibraryService;