import mongoose from "mongoose";

const ProfileSchema = mongoose.Schema({
    address:{
        type :{
            phonenumber: Number,
            country: String
        },
        default:{
            phonenumber: null,
            country: ""
        }
    },
    socials:{
        type: {
            facebook: String,
            twitter: String,
            instagram: String
        },
        default:{
            facebook: null,
            twitter: null,
            instagram: null
        }
    },
    interests: {
        type: [String],
    },
    cardInfo: {
        type: {
            number: String
        },
        default:{
            number: ""
        }
    },
    bio:{
        type: String,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true});

const ProfileModel = mongoose.model('Profile',ProfileSchema);

export default ProfileModel;