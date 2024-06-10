import LibraryService from "./LibraryService.js";

const libraryService = new LibraryService();

class LibraryController {

    // async createLibrary (req,res) {
    //     const library = await libraryService.createLibrary()
    // }

    async getLibrary (req,res) {
        const data = await libraryService.getLibrary(req.user.userId);
        console.log({data});
        if(!data) return res.status(200).json({success:true,message:"Your library is empty", data:{library:[],recentlyOpened:[]}});
        return res.status(200).json({success:true,message:"Library Sent",data:{library:data,recentlyOpened:[]}});
    }

    async addRecentlyOpened () {

    }

}

export default LibraryController;