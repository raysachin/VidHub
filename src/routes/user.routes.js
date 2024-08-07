import {Router} from "express"
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";

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




// export router
export default router