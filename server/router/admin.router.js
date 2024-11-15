import express from 'express';
import { getAdminData, getAllChats, getAllMessages, getAllUsers, getDashboardStats, logout, verifyAdmin } from '../controllers/admin.controller.js';
import { adminLoginValidator, handleValidationError } from '../lib/validator.js';
import { adminRoute } from '../middleware/auth.js';

const adminRouter= express.Router();


adminRouter
.route('/verify')
.post(adminLoginValidator(),handleValidationError,verifyAdmin)

adminRouter
.route('/logout')
.get(logout)

adminRouter.use(adminRoute)

adminRouter
.route('/')
.get(getAdminData)

adminRouter
.route('/users')
.get(getAllUsers)

adminRouter
.route('/chats')
.get(getAllChats)

adminRouter
.route('/messages')
.get(getAllMessages)


adminRouter
.route('/stats')
.get(getDashboardStats)


export {adminRouter}