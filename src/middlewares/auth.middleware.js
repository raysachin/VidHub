import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

import jwt from "jsonwebtoken"
import {User} from "../models/user.model"



export const verifyJWT = asyncHandler(async(req, res, next) =>{
    try {
        // access the token, req ke pass cookie ka acccess hai
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        // agar token nii hai to
        if(!token){
            throw new ApiError(401, "Unauthorization request")
        }
    
        // agar token hai to hme JWT ka use krke puchna pdega ye token shi hai ya nii hai and is token ke andr kya kya info hai
        const decodededToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodededToken?._id).select("-password -refreshToken")
    
        if(!user){
            // TODO Discuss about frontend
    
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.messgae || "Invalid access token")
        
    }




})