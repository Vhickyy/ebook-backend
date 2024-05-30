import { generateJWT } from "../../utils/jwt.js";
import { comparePassword, encryptPassword } from "../../utils/password.js";
import { generateOtp } from "../../utils/userUtil.js";
import { sendEmail } from "../../utils/utils.js";
import AnonymousCartModel from "../anonymousCart/AnonymousCartModel.js";
import CartModel from "../cart/CartModel.js";
import ProfileService from "../profile/ProfileService.js";
import UserModel from "./UserModel.js";

const profileService = new ProfileService();

class AuthService {

    async registerUser (data,res) {
        const userExist = await UserModel.findOne({email:data.email});
        if(userExist){
            res.status(400);
            throw new Error("Email already in use!")
        }
        data.password = await encryptPassword(data.password);
        const code =  generateOtp();
        const userData = await UserModel.create({...data,otpEmailVerify:{code,expire: new Date(Date.now() + (1000 * 60 * 5))}});
        await profileService.createProfile(data?.interest,userData._id,data?.profile,res)
        // const {password, ...user} = userData._doc;
        // send mail
        // await sendEmail({subject:"Verify Email",email:data.email,message:code})
        const {password, forgotPassword, ...user} = userData.toJSON();
        return user;
    }


    async loginUser ({email,password,uuid},res) {
        const user = await UserModel.findOne({email});
        const validPassword = await comparePassword(password,user?.password);
        if(!user || !validPassword){
            res.status(400);
            throw new Error("Provide Valid Credentials")
        }
        if(!user.isVerified){
            res.status(400);
            throw new Error("Please verify your account.")
        }
        delete user["_doc"].password;
        if(!uuid){
            const cart = await CartModel.findOne({user:user._id});
            return {user,cart};
        }
        let annonymousCart = await AnonymousCartModel.findOne({uuid}).populate("items","price");
        // console.log({annonymousCart});
        // if(annonymousCart.removedAt < Date.now()){
        //     annonymousCart = []
        // }
        let cart = await CartModel.findOne({user:user._id}).populate("items","price");
        const merge = [...(annonymousCart ? annonymousCart.items : []),...(cart ? cart.items : [])];
            let mergeCarts = {};
            for(let i = 0; i < merge.length; i++){
                if(!mergeCarts[merge[i]._id.toString()]){
                    mergeCarts[merge[i]._id.toString()] = merge[i].price;
                }
            }
        // check if an author added his book to annonymous cart because author shoulg not buy their book
        if(!cart){
            const {orderValue,discount,total} = annonymousCart;
            cart = await CartModel.create({user:user._id,items:Object.keys(mergeCarts),orderValue,discount,total})
        }else{
            // const merge = [...annonymousCart.items,...cart.items];
            // let mergeCarts = {};
            // for(let i = 0; i < merge.length; i++){
            //     if(!mergeCarts[merge[i]._id.toString()]){
            //         mergeCarts[merge[i]._id.toString()] = merge[i].price;
            //     }
            // }
            const orderValue = Object.values(mergeCarts).reduce((acc,val) => acc += val, 0);
            cart.items = Object.keys(mergeCarts); 
            cart.orderValue = orderValue;
            cart.discount = 0;
            cart.total = orderValue;
            await cart.save();
        }
        await AnonymousCartModel.findOneAndDelete({uuid});
        return {user,cart}
    }


    async logout(email){
        const user = await UserModel.findOne({email});
        const token = generateJWT(Date.now())
        return token;
    }

    async verifyEmail (email,code,res) {
        const user = await UserModel.findOne({email});
        if(!user){
            res.status(404);
            throw new Error("Invalid Email")
        } 
        if(user.otpEmailVerify.code != code){
            return false;
        }
        // check if code is still valid
        const expiredOtp = new Date(user.otpEmailVerify.expire) < new Date(Date.now());
        if(expiredOtp){
            res.status(404);
            throw new Error("Otp Expired")
        }
        user.isVerified = true;
        user.otpEmailVerify = {code:null,expire:null};
        await user.save();
        return true;
    }

    async resendOtp (email) {
        const user = await UserModel.findOne({email});
        if(!user) return false;
        const code =  generateOtp();
        // send mail
        // await sendEmail({subject:"Verify Email",email,message:code});
        user.otpEmailVerify = {code,expire: new Date(Date.now() + (1000 * 60 * 5))};
        await user.save();
        return true;
    }

    async forgotPassword (email) {
        const user = await UserModel.findOne({email});
        if(!user) return false;
        const forgotPasswordOtp =  generateOtp();
        user.forgotPassword = {code:forgotPasswordOtp,expire:new Date(Date.now() + (1000 * 60 * 5))};
        // send mail
        // await sendEmail({subject:"Verify Email",email,message:forgotPasswordOtp})
        await user.save();
        return true
    }

    async verifyForgotPasswordCode (email,code,res) {
        const user = await UserModel.findOne({email});
        if(!user){
            res.status(404);
            throw new Error("Invalid Email")
        }
        if(user.forgotPassword.code != code)return false
        const expiredOtp = new Date(user.forgotPassword.expire) < new Date(Date.now());
        if(expiredOtp){
            res.status(404);
            throw new Error("Otp Expired")
        }
        user.forgotPasswordOtp = {code:null,expire:null};;
        await user.save();
        return true;
    }

    async resendForgotPasswordOtp (email) {
        const user = await UserModel.findOne({email});
        if(!user) return false;
        const forgotPasswordOtp =  generateOtp();
        // send mail
        // await sendEmail({subject:"Reset Password",email,message:forgotPasswordOtp});
        user.forgotPassword = {code:forgotPasswordOtp,expire:new Date(Date.now() + (1000 * 60 * 5))};
        await user.save();
        return true;
    }

    async resetPassword (newPassword, email) {
        const user = await UserModel.findOne({email}); 
        if(!user)return false;
        user.password = await encryptPassword(newPassword);
        await user.save();
        return true;
    } 

    async becomeAnAuthor (req,res) {
        // 
    }

    async getUser(req){
        const user = await UserModel.findById({_id:req.user.userId});
        if(!user) return false;
        const {password, ...rest} = user.toJSON();
        return rest;
    }

}

export default AuthService;