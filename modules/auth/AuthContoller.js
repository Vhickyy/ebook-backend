import { generateJWT } from "../../utils/jwt.js";
import AuthService from "./AuthService.js"

const authService = new AuthService;

class AuthController {

    async registerUser (req,res) {
        const {fullname,email,password} = req.body;
        const user = await authService.registerUser({fullname,email,password},res);
        return res.status(201).json({success: "true",data:{user},message:"User Created Successfully"});
    }

    async loginUser (req,res) {
        const {email,password,uuid} = req.body;
        const {user,cart} = await authService.loginUser({email,password,uuid},res);
        const token = generateJWT(user._id,user.role);
        // console.log({cart},"control");
        return res.status(200).json({success: "true",data:{user,token,carts:cart},message:"Login Successful"})
    }

    async logout(){
        // const 
    }

    async verifyEmail (req,res) {
        const {email,code} = req.body;
        if(!code) return res.status(400).json({success: false, message:"Code is needed."})
        const result = await authService.verifyEmail(email,code,res);
        if(!result) return res.status(404).json({success:false, message:"Invalid Code"});
        return res.status(200).json({success:true,message:"Email Verified"})
    }

    async resendOtp(req,res){
        const user = await authService.resendOtp(req.body.email);
        if(!user) return res.status(404).json({success:false, message:"Invalid Email"});
        return res.status(200).json({success:true, message:`Code sent to ${req.body.email}`})
    }
    

    async forgotPassword (req,res) {
        const user = await authService.forgotPassword(req.body.email);
        if(!user) return res.status(404).json({success:false, message:"Provide valid email."});
        return res.status(200).json({success:true, message:`Code sent to ${req.body.email}`})
    }

    async verifyForgotPasswordCode (req,res) {
        const {email,code} = req.body;
        if(!code) return res.status(400).json({success: false, message:"Code is needed."})
        const result = await authService.verifyForgotPasswordCode(email,code,res);
        if(!result) return res.status(404).json({success:false, message:"Invalid Code"});
        return res.status(200).json({success:true,message:"Email Verified"})
    }

    async resendForgotPasswordOtpndOtp(req,res){
        const user = await authService.resendForgotPasswordOtp(req.body.email);
        if(!user) return res.status(404).json({success:false, message:"Invalid Email"});
        return res.status(200).json({success:true, message:`Code sent to ${req.body.email}`})
    }

    async resetPassword (req,res) {
        const {newPassword, confirmPassword, email} = req.body;
        if((!newPassword || !confirmPassword)) return res.status(400).json({success:false, message:"Password is required."});
        if((newPassword !== confirmPassword)) return res.status(400).json({success:false, message:"Password do not match."});
        const result = await authService.resetPassword(newPassword,email);
        if(!result) return res.status(404).json({success:false, message:"Invalid Email"});
        return res.status(200).json({success:true, message:`Password changed successfully`})
    }

    async becomeAnAuthor (req,res) {
        // 
    }

    async getUser (req,res) {
        const user = await authService.getUser(req);
        if(!user) return res.status(404).json({success:false,message:"No user found"});
        return res.status(200).json({success:true,data:user,message:"User sent"})
    }
}

export default AuthController;

