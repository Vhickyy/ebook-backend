import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    email: {
        type: String
    },
    fullname: {
        type:String
    },
    password: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "user"
    },
    profilePic: {
        type: String
    },
    otpEmailVerify:{
        type: {
            code: Number,
            expire: Date,
        },
        default :{
            code: null,
            expire: null
        }
    },
    forgotPassword: {
        type: {
            code: Number,
            expire: Date,
        },
        default :{
            code: null,
            expire: null
        }
    }

},{timestamps:true});

const UserModel = mongoose.model("User",userSchema);
export default UserModel;