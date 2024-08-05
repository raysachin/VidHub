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


const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // Access token to user ko de dete hai lekin refresh token hmare databse me v save krke rakhna hota hai
        // save the refresh token in databse
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken};



    } catch(error){
        throw new ApiError(500, "Something went wrong while generating refresh and accsess token")
    }
}


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


// Create method login user
const loginUser = asyncHandler(async (req, res) =>{
    // Step 1: Get the user credentials from the request body
    const {email, username, password} = req.body;

    //Step 2: agar username v nii hai or email v nii hai
    if(!email || !username){
        throw new ApiError(400, "Email or Username is required");
    }

    //Step : 3 Find username or email in database
    const user = await User.findOne({
        $or: [{username}, {email}]  // it will find value on the basis of username or email
    })

    // Agar user mila hi nii kisi v bais p then
    if(!user){
        throw new ApiError(404, "User Not Found");
    }

    // Step 4: Check the password

    // here we use user Not User because client are user not The User, User is mongodb data base user

    const isPasswordValid = await user.isPasswordCorrect(password);

    // Password is incorrect
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid Password");
    }

    // Step 5: If passwrod correct then make access and refresh token and send it to the user
    
    // Now call the method
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)



    // optional
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    // Step 6: Send tokens in cookies
    const options = {
        httpOnly: true, // The cookie only accessible by the web server, we cannot modified from frontend
        secure: true

    }

    // return the response
    return res
    .status(200)
    .cookie("accessToke", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    )

})

// Crete method for logged out
const logoutUser = asyncHandler(async(req, res) =>{
     // find the user, kaise aaya middleware ki help se
    await User.findByIdAndUpdate(
        req.user._id,
        {
            // Jo jo update krna hai wo yha likhna hai
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true, // The cookie only accessible by the web server, we cannot modified from frontend
        secure: true

    }

    // clear the cookies
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "USer Logged Out Successfully"))
})

// export
export {
    registerUser,
    loginUser,
    logoutUser
}