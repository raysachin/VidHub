import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            // to make a field searchable in optimized way make index as true, as it is expensive
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            // to make a field searchable in optimized way make index as true, as it is expensive
            index: true
        },
        avatar: {
            type: String, // cloudnary url
            required: true,
        },
        coverImage: {
            type: String, // cloudnary url
        },
        watchHistory:[
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password:{
            type: String, // chaalngining to encrypt at this moment because at this time we cannot encrypt this becuase we have to compare it
            required: [true, 'Password is required']
        },
        refreshToken:{
            type: String
        }
    },
    {
        timestamps: true
    }
)

// encrypt the user password on modification
userSchema.pre("save", async function (next) {
    // password field ko lo encrypt kr do with 10 number of round

    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
    next() 
})

// method to check that password is correct or not
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)

}

// geberate access token and refresh token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            // payload
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        // access token
        process.env.ACCESS_TOKEN_SECRET,
        {
            // object
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            // payload
            _id: this._id,
        },
        // access token
        process.env.REFRESH_TOKEN_SECRET,
        {
            // object
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


// export
export const User = mongoose.model("User", userSchema);