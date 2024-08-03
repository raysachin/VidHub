import {asyncHandler} from "../utils/asyncHandler.js";


// create method to register users
const registerUser = asyncHandler(async (req, res) => {
    return res.status(200).json({
        message: "ok done"
    })
})

// export
export {registerUser}