import express from "express";
import {
    addMembers,
    createGroupChat,
    deleteChat,
    getChatDetails,
    getMessages,
    getMyChats,
    getMyGroupChats,
    leaveGroup,
    removeMember,
    renameGroup,
    sendAttachemts
} from "../controllers/chat.controller.js";

import {
    addMembersValidator,
    chatIdValidator,
    handleValidationError,
    newGroupValidator,
    removeMemberValidator,
    renameGroupValidator,
    sendAttachemtsValidator
} from "../lib/validator.js";
import { protectRoute } from "../middleware/auth.js";
import { uploadAttachment } from "../middleware/multer.js";

export const chatRouter = express.Router();


chatRouter.use(protectRoute)

chatRouter
    .route('/create')
    .post(newGroupValidator(), handleValidationError, createGroupChat)

chatRouter
    .route('/me')
    .get(getMyChats)

chatRouter
    .route('/me/groups')
    .get(getMyGroupChats)

chatRouter
    .route('/addmembers')
    .patch(addMembersValidator(), handleValidationError, addMembers)

chatRouter
    .route('/removemember')
    .patch(removeMemberValidator(), handleValidationError, removeMember)

chatRouter
    .route('/leave/:id')
    .delete(chatIdValidator(), handleValidationError, leaveGroup)

chatRouter
    .route('/message')
    .post(uploadAttachment, sendAttachemtsValidator(), handleValidationError, sendAttachemts)



chatRouter
    .route('/message/:id')
    .get(chatIdValidator(), handleValidationError,getMessages)


chatRouter
    .route("/:id")
    .get(chatIdValidator(), handleValidationError,getChatDetails)
    .patch(renameGroupValidator(),handleValidationError,renameGroup)
    .delete(chatIdValidator(), handleValidationError,deleteChat)







