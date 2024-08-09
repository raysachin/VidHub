import {Router} from "express"
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js";

import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)


// router.route("/login").post(loginUser)
router.route("/login").post(loginUser)

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken)  // yha p verify jwt nii lgana pda kyuki hmne wo sab kaam controller me hi kr diya

// router to change password
router.route("/change-password").post(verifyJWT, changeCurrentPassword)

// Router for current user
router.route("/current-user").get(verifyJWT, getCurrentUser)

// Route for update account details
router.route("/update-account").patch(verifyJWT, updateAccountDetails)  // patch because all details should not be updated when request to change one details, so we will not use post

// Routes for update avatar
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

// router for cover Image
router.route("/update-cover-image").patch(verifyJWT, upload.single("/coverImage"), updateUserCoverImage)

// Router for channel profile
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

// Router for watch history
router.route("/watch-history").get(verifyJWT, getWatchHistory)






// export router
export default router