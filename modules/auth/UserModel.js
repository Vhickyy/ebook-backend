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
    interests: {
        type: [String],
    },
    profilePic: {
        type: String
    },
    otpEmailVerify:{
        type: Number
    },
    verifyOtpToken:{
        type: String
    },
    forgotPasswordToken:{
        type: String
    },
    profileId: {
        type: mongoose.Types.ObjectId,
        ref: "Profile"
    }

},{timestamps:true});

const UserModel = mongoose.model("User",userSchema);
export default UserModel;