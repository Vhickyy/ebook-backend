import mongoose from "mongoose";
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

    async getPdf (req,res) {
        if(!req.params.id || !mongoose.isValidObjectId(req.params.id ))return res.status(400).json({success:false,message:"Provide valid Id"});
        const book = await libraryService.getPdf(req.params.id,req.user.userId);
        if(!book) return res.status(404).json({success:false,message:"No book found in your library."});
        return res.status(200).json({success:true,message:"Book sent succesfully",data:book})
    }

}

export default LibraryController;