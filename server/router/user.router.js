import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';
import { acceptRequest, getMyFriends, getMyNotifications, getUserProfile, searchUser, sendRequest } from '../controllers/user.controller.js';
import { acceptRequestValidator, handleValidationError, loginValidator, registerValidator, sendRequestValidator } from '../lib/validator.js';
import { protectRoute } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/multer.js';
export const userRouter = express.Router();

userRouter.route('/login').post(
    loginValidator(),
    handleValidationError,
    login
);

userRouter.route('/signup').post(
    uploadAvatar,
    registerValidator(),
    handleValidationError,
    signup
);
userRouter.route('/logout').get(logout)

userRouter.use(protectRoute);

userRouter.route('/profile').get(getUserProfile);
userRouter.route('/search').get(searchUser)
userRouter.route('/sendrequest').post(sendRequestValidator(), handleValidationError, sendRequest)
userRouter.route('/acceptrequest').patch(acceptRequestValidator(), handleValidationError, acceptRequest)
userRouter.route('/notifications').get(getMyNotifications)
userRouter.route('/friends').get(getMyFriends)
