import mongoose from "mongoose";

const LibrarySchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: "Book"
    },
    recentlyOpened: {
        type: Boolean,
        default: false
    }

},{timestamps:true});

const LibraryModel = mongoose.model("Library",LibrarySchema);

export default LibraryModel;