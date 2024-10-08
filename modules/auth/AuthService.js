import { uploadToS3 } from "../../services/cloudinary.js";
import { generateJWT, verifyToken } from "../../utils/jwt.js";
import { comparePassword, encryptPassword } from "../../utils/password.js";
import { generateOtp } from "../../utils/userUtil.js";
import { sendEmail } from "../../utils/utils.js";
import AnonymousCartModel from "../anonymousCart/AnonymousCartModel.js";
import CartModel from "../cart/CartModel.js";
import LibraryModel from "../library/LibraryModel.js";
import ProfileModel from "../profile/ProfileModel.js";
import ProfileService from "../profile/ProfileService.js";
import UserModel from "./UserModel.js";
import {Types} from "mongoose";

const profileService = new ProfileService();

class AuthService {

    async registerUser (data,profilePic,res) {
        const userExist = await UserModel.findOne({email:data.email});
        if(userExist){
            res.status(400);
            throw new Error("Email already exist for this app.!")
        }
        data.password = await encryptPassword(data.password);
        

        // =============== Upload Profile Picture ================== //
        let upload;
        if(profilePic){
            const picName = `${Date.now()}.${profilePic.originalname.split('.').pop()}`;
            try {
                upload = await uploadToS3(profilePic,picName,profilePic.mimetype);
            } catch (error) {
                // console.log(error);
            }
        }
        data.profilePic = upload ? upload : null;
        data.interests = data.interest.split(",");

        // ============ Save User To DB And Create Profile ============ //
        const userData = await UserModel.create({...data});
        data.user = userData._id;
        // await profileService.createProfile(data,res);
        
        
        // ================ Generate Token And Code for Email Code Verification ================== //
        const token = generateJWT(userData._id,userData.role,'2m');
        const code =  generateOtp();
        userData.otpEmailVerify = code;
        userData.verifyOtpToken = token;
        await userData.save();

        // const {password, ...user} = userData._doc;


        // ==================== Send Mail ================== //
        // await sendEmail({subject:"Verify Email",email:data.email,message:code})
        // const {otpEmailVerify, ..._user} = userData.toJSON();
        // console.log("hey");
        return true;
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
            if(cart) await cart.populate({path:"items",populate:{path:"author frontCover"}});
            return {user,cart};
        }

        let annonymousCart = await AnonymousCartModel.findOne({uuid}).populate({path:"items",populate:{path:"author _id"}});

        // ============= Check if an author added his book to annonymous cartand remove it ============ //
        if(user?.role == 'author' && annonymousCart?.items){
            annonymousCart.items = annonymousCart.items.filter(item => {
                return item.author._id.toString() !== user._id.toString()
            });
        }
        console.log("yooo");


        // =========== Check If A Book Bought By User Is In Anonymous Cart ================== //
        const lib = await LibraryModel.find({user:user._id});

        if(lib.length){
            let inLib = [];
            let strCart = [];
            
            // ============ Remove bought book from anonymous cart ============ //
            if(annonymousCart?.items.length){
                for(let i = 0; i < annonymousCart.items.length; i++){
                    // console.log({ann:annonymousCart.items[i]});
                    strCart.push(annonymousCart.items[i]._id.toString());
                    const item  = lib.find(lib => {
                        console.log(lib.book.toString(),"ohh");
                        return lib.book.toString() == annonymousCart.items[i]._id.toString()
                    });

                    if(item){
                        inLib.push(item.book.toString())
                    }
                }

                if(strCart.length === inLib.length){
                    annonymousCart = {};

                }else{
                    const newCartSet = strCart.filter(item => !inLib.includes(item));
                    annonymousCart.items = newCartSet;
                    annonymousCart = await annonymousCart.save();
                    await annonymousCart.populate("items","price")
                }
            }

        }

        let cart = await CartModel.findOne({user:user._id}).populate("items","price");


        // =========== Merge Anonymous Cart with Main Cart =========== //
        if(annonymousCart?.items && annonymousCart?.items?.length){
            await annonymousCart.populate("items","price")
            console.log({annonymousCart});
            const merge = [...(annonymousCart ? annonymousCart.items : []),...(cart ? cart.items : [])];
            console.log({merge});
            let mergeCarts = {};
            for(let i = 0; i < merge.length; i++){
                if(!mergeCarts[merge[i]._id.toString()]){
                    mergeCarts[merge[i]._id.toString()] = merge[i].price;
                }
            }

            if(!cart){
                const {orderValue,discount,total} = annonymousCart;
                cart = await CartModel.create({user:user._id,items:Object.keys(mergeCarts),orderValue,discount,total})

            }else{
                const orderValue = Object.values(mergeCarts).reduce((acc,val) => acc += val, 0);
                cart.items = Object.keys(mergeCarts); 
                cart.orderValue = orderValue;
                cart.discount = 0;
                cart.total = orderValue;
                await cart.save();
            }
        }

        await AnonymousCartModel.findOneAndDelete({uuid});
        if(cart){
            await cart.populate({path:"items",populate:{path:"author frontCover"}});
        }else{
            cart = [];
        }
        return {user,cart}
    }


    async logout(email){
        const user = await UserModel.findOne({email});
        const token = generateJWT(Date.now())
        return token;
    }

    async verifyEmail (userData,res) {
        let token;
        try {
            token = verifyToken(userData.token);
        } catch (error) {
            res.status(400);
            throw new Error("Expired Code.")
        }
        const {userId} = token;
        const user = await UserModel.findById({_id:userId});
        if(user.isVerified){
            res.status(400);
            throw new Error("User Already Verified")
        }
        
        if(user.otpEmailVerify != userData.code){
            return false;
        }
        const profile = await profileService.createProfile({user:userId},res);
        console.log({profile});
        user.profileId = profile._id
        user.isVerified = true;
        user.otpEmailVerify = null;
        user.verifyOtpToken = '';
        await user.save();
        return true;
    }

    async resendOtp (email) {
        const user = await UserModel.findOne({email});
        if(!user) return false;
        const code =  generateOtp();
        const token = generateJWT(user._id,user.role,'2m');
        // send mail
        // await sendEmail({subject:"Verify Email",email,message:code});
        console.log({code,token});
        user.otpEmailVerify = code;
        user.verifyOtpToken = token;
        await user.save();
        console.log('hu');
        return {code,token};
    }

    async forgotPassword (email) {
        const user = await UserModel.findOne({email});
        if(!user) return false;
        const token = generateJWT(user._id,user.role,'2m');
        user.forgotPasswordToken = token;
        // send mail
        // await sendEmail({subject:"Verify Email",email,message:forgotPasswordOtp})
        await user.save();
        return true;
    }


    async resetPassword (newPassword, usertoken,res) {
        let token;
        try {
            token = verifyToken(usertoken);
        } catch (error) {
            res.status(400);
            throw new Error("Invalid token.")
        }
        const {userId} = token;
        const user = await UserModel.findById({_id:userId});
        if(!user)return false;
        user.password = await encryptPassword(newPassword);
        await user.save();
        return true;
    } 

    // ======== works for both becoming an author and editing author info ============ //
    async becomeAnAuthor (userData,profilePic,res) {
        const {socials,id} = userData;
        if(socials){
            // check if social handles are valid
        }

        // ========== save profile image to aws =========== //
        let upload;
        const user = await UserModel.findById({_id:id});

        if(profilePic){
            const picName = `${Date.now()}.${profilePic.originalname.split('.').pop()}`;
            try {
                upload = await uploadToS3(profilePic,picName,profilePic.mimetype);
                user.profilePic = upload ? upload : null;
            } catch (error) {
                // console.log(error);
            }
        }
        
        // ======== update User and Profile ========= //
        user.role = "author"
        const profile = await profileService.becomeAuthor(userData,user.profileId);
        if(!profile) {
            res.status(500);
            throw new Error("Error updating user's profile");
        }
        await user.save();
        const token = generateJWT(user._id,user.role);
        return {token,user};
    }

    

    async getUser(req){
        const user = await UserModel.findById({_id:req.user.userId});
        if(!user) return false;
        const {password, ...rest} = user.toJSON();
        return rest;
    }

}

export default AuthService;