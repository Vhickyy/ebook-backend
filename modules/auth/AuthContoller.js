import mongoose from "mongoose";
import { generateJWT } from "../../utils/jwt.js";
import AuthService from "./AuthService.js"
import UserModel from "./UserModel.js";

const authService = new AuthService;

class AuthController {

    async registerUser (req,res) {
        // const {fullname,email,password,profile,phonenumber} = req.body;
        const user = await authService.registerUser(req.body,req.file,res);
        return res.status(201).json({success: "true",message:"User Created Successfully"});
    }

    async loginUser (req,res) {
        const {email,password,uuid} = req.body;
        const {user,cart} = await authService.loginUser({email,password,uuid},res);
        const token = generateJWT(user._id,user.role);
        // console.log({cart},"control");
        console.log({token,cart,user});
        return res.status(200).json({success: "true",data:{user,token,carts:cart},message:"Login Successful"})
    }

    async logout(){
        // const token = await authService.logout();
        return res.status(200).json({success:true,message:"Log out auccessful"})
    }

    async verifyEmail (req,res) {
        const {code,token} = req.body;
        if(!code) return res.status(400).json({success: false, message:"Code is required."})
        const result = await authService.verifyEmail({token,code},res);
        if(!result) return res.status(404).json({success:false, message:"Invalid Code"});
        return res.status(200).json({success:true,message:"Email Verified"})
    }

    async resendOtp(req,res){
        const user = await authService.resendOtp(req.body.email);
        if(!user) return res.status(404).json({success:false, message:"Invalid Email"});
        return res.status(200).json({success:true, message:`Code sent to ${req.body.email}`,data:user})
    }
    

    async forgotPassword (req,res) {
        const user = await authService.forgotPassword(req.body.email);
        if(!user) return res.status(404).json({success:false, message:"Provide valid email."});
        return res.status(200).json({success:true, message:`Code sent to ${req.body.email}`})
    }

    async resetPassword (req,res) {
        const {newPassword, confirmPassword, token} = req.body;
        console.log({token});
        if((!newPassword || !confirmPassword)) return res.status(400).json({success:false, message:"Password is required."});
        if((newPassword !== confirmPassword)) return res.status(400).json({success:false, message:"Password do not match."});
        const result = await authService.resetPassword(newPassword,token,res);
        if(!result) return res.status(404).json({success:false, message:"Invalid Email"});
        return res.status(200).json({success:true, message:`Password changed successfully`})
    }

    async becomeAnAuthor (req,res) {
        const { location, bio, cardInfo, socials} = req.body;
        console.log({location,bio,cardInfo:JSON.parse(cardInfo)});
        const {bankName,bankHolder,accountNumber} = JSON.parse(cardInfo);
        console.log({bankHolder,bankName,accountNumber});
        if(!bankHolder || !bankName || !accountNumber || !location || !bio) return res.status(400).json({success:false, message: "Bank details, location and bio are required."})
        req.body.id = req.user.userId;
        req.body.cardInfo = JSON.parse(cardInfo);
        if(socials) req.body.socials = JSON.parse(socials)
        const user = await authService.becomeAnAuthor(req.body,req.file,res)
        return res.status(200).json({success:true,message:"Author profile success",data:user})
    }

    async getUser (req,res) {
        console.log("calling");
        const user = await authService.getUser(req);
        if(!user) return res.status(404).json({success:false,message:"No user found"});
        return res.status(200).json({success:true,data:user,message:"User sent"})
    }

    async getAuthor(req,res){
        const {authorId } = req.params;
        if(!authorId || !mongoose.isValidObjectId(authorId)) return res.status(400).json({success:true,message:"Provide a valid author id"})
        const author = await UserModel.findById({_id:req.params.authorId}).select('fullname profilePic profileId role').populate('profileId');
        console.log({author});
        if(!author || author.role !== 'author') return res.status(404).json({success:true,message:"No author found for the provided id"})
        return res.status(200).json({success:true,message:"author detail sent",data:author})
    }



    // ================= Providing Assistance ======================= //

    async getEmailVerifyCode(req,res){
        const user = await UserModel.findOne({email:req.params.email});
        if(!user){
            return res.status(404).json({success:false,message:"Invalid Email"});
        }
        return res.status(200).json({success:true,data:{code:user.otpEmailVerify,token:user.verifyOtpToken}})
    }

    async getForgotPasswordCode(req,res){
        const user = await UserModel.findOne({email:req.params.email});
        if(!user){
            return res.status(404).json({success:false,message:"Invalid Email"});
        }
        console.log({u:'hu'});
        return res.status(200).json({success:true,data:{token:user.forgotPasswordToken}})
    }


}

export default AuthController;

