import { body, validationResult, param } from "express-validator";
import mongoose from "mongoose";

const validationLayer = (validations) => {
    return ([
        validations,
        (req,res,next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                const errMsg = errors.array().map(err=> err.msg);
                res.status(400);
                if(errMsg[0].startsWith("Invalid")){
                    res.status(404);
                }
                throw new Error(errMsg[0])
            }
            next()
        }
    ])
}


// Auth validtion
export const registerValidation = validationLayer([
    body("fullname").notEmpty().withMessage("Please provide all fields"),
    body("email").notEmpty().withMessage("Please provide all fields").isEmail().withMessage("Please provide a valid email."),
    body("password").notEmpty().withMessage("Please provide all fields")
])

export const loginValidation = validationLayer([
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email."),
    body("password").notEmpty().withMessage("Password is required")
])
export const verifyOtpValidation = validationLayer([
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email."),
    body("otpCode").notEmpty().withMessage("Invalid code")
])
export const resendOtpValidation = validationLayer([
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid.")
])


export const paramIdValidation = validationLayer([
    param("id").custom(async (id ) => {
        const validId = mongoose.Types.ObjectId.isValid(id);
        if(!validId){
            throw new Error(`Invalid id - ${id}`);
        }
    })
])


// Book Validation
export const bookValidation = validationLayer([
    body("title").notEmpty().withMessage("Please provide all fields"),
    body("description").notEmpty().withMessage("Please provide all fields"),
    body("pages").notEmpty().withMessage("Please provide all fields"),
    body("ISBN").notEmpty().withMessage("Please provide all fields"),
    body("price").notEmpty().withMessage("Please provide all fields"),
    // body("dateOfPublication").notEmpty().withMessage("Please provide all fields"),
    // body("publisher").notEmpty().withMessage("Please provide all fields"),
    // body("keywords").notEmpty().withMessage("Please provide all fields"),
])
