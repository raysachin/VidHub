import {asyncHandler} from "../utils/asyncHandler.js";

// import ApiError file
import {ApiError} from "../utils/ApiError.js";

// import user
import {User} from "../models/user.model.js"
// This user can directly contact with data base becuase it is created using mongodb


// for uploading on cloudinary
import {uploadOnCloudinary} from "../utils/cloudinary.js"


// import Api Response
import { ApiResponse } from "../utils/ApiResponse.js";

// create method to register users
const registerUser = asyncHandler(async (req, res) => {
    
    // Step 1: Get user details from frotend
    const {fullname, email, username, password} = req.body  // body se data aa rha hai, url se v aa skta hai 
    // console.log("email: ", email); // you can test it from the postman
    // console.log("fullname: ", fullname);
    // console.log("username: ", username);
    // console.log("password: ", password);



    // step 2: validation -> check each field that it is empty or not
    // if(fullname === ""){
    //     throw new ApiError(400, "Full Name is Required")
    // } // aise krkr sare file check rk skte hai

    // alternative way to check all at once
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // you can add validation on formatting of email, you can use string method include @raysachin


    // Step 3: User already exist or not
    const existedUser = await User.findOne({
        $or: [{username}, {email}]  // it will find both
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exist")
    }

    // console.log(req.files);
    // Step 4: Check for images
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path; // it is optional
    // console.log("avatarLocalPath: ", avatarLocalPath);

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path

    }



    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar File is required")
    }

    // Step 5 : Upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // Step 6: Check for avatar
    if(!avatar){
        throw new ApiError(400, "Avatar File is required")
    }

    // Step 7: Make an object and make an entry in database
    const user = await User.create({
        fullname,
        avatar: avatar.url,  // avaratr is 100 present because it is required
        coverImage: coverImage?.url || "", // it is optional so handle it
        email,
        password,
        username: username.toLowerCase()

    })

    // here we have to chcek user is empty?
    // Step 8: Remove the password field
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" // password and refresh token remove
    )  // _id is already created by mongodb for each user

    if(!createdUser){
        throw new ApiError(500, "Failed to create user")
    }

    // Step 9: Agar user successfully create ho chuka hai to response me bhej do
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Register Successfully")
    )


    



    
})

// export
export {registerUser}