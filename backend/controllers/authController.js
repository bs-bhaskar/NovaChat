


const User = require("../models/User");
const sendOtpToEmail = require("../services/emailService");
const otpGenerate = require("../utils/otpGenerater");
const response = require("../utils/responseHandler");
const twilloService=require('../services/twilloService.js');
const generateToken = require("../utils/generateToken.js");

//step 1 Send OTP
const sendOtp = async(req,res)=>{
    const {phoneNumber,phoneSuffix,email}=req.body;
    const otp=otpGenerate();
    const expiry= new Date(Date.now()+5*60*1000);
    let user ;  
    try {
        if(email){
            user= await User.findOne({email})

            if(!user){
                user = new User({email})
            }
            user.emailOtp=otp;
            user.emailOtpExpiry=expiry;

            await user.save();
            await sendOtpToEmail(email,otp)
            return response(res,200,'OTP sent to your email',{email})
        }
        if(!phoneNumber || !phoneSuffix){
            return response(res,400,'Phone number and suffix are required')
        }
        const fullPhoneNumber=`${phoneSuffix}${phoneNumber}`
        user=await User.findOne({phoneNumber});
        if(!user){
            user= await new User ({phoneNumber,phoneSuffix})
        }
        await twilloService.sendOtpToPhoneNumber(fullPhoneNumber)
        await user.save();

        return response(res,200,'otp send successfully',user)
    } catch (error) {
        console.error(error);
        return response(res,500,'Internal server error')
    }
}

// step 2 verify OTP

const verifyOtp=async(req,res)=>{
    const {phoneNumber,phoneSuffix,email,otp}=req.body;
    try {
        let user;
        if(email){
            user= await User.findOne({email})
            if(!user){
                return response(res,404,'User not found')
            }
            const now=new Date();
            if(!user.emailOtp || String(user.emailOtp)!==String(otp) || now>new Date(user.emailOtpExpiry)){
                return response(res,400,'Invalid Expire otp')
            };
            user.isVarified=true;
            user.emailOtp=null;
            user.emailOtpExpiry=null;
            await user.save();
        }
        else{
            if(!phoneNumber || !phoneSuffix){
                return response(res,400,'Phone number and suffix are required')
            }
            const fullPhoneNumber=`${phoneSuffix}${phoneNumber}`;
            user=await User.findOne({phoneNumber});
            if(!user){
                return response(res,404,'User not found')
            }
            const result= await twilloService.verifyOtp(fullPhoneNumber,otp)
            if(result.status !== 'approved'){
                return response(res,400,'Invalid otp'); 
            }
            user.isVarified=true;
            await user.save();
        }
        const token=generateToken(user?._id);
        res.cookie("auth_token",token,{
            httpOnly:true,
            maxAge:1000*60*60*24*365
        });
        return response(res,200,'Otp Verified successfully',{token,user})
    } catch (error) {
        console.error(error);
        return response(res,500,'Internal server error')
    }
}

module.exports={
    sendOtp,
    verifyOtp
}