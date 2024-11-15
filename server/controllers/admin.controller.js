import { chatModel } from "../models/chat.model.js";
import { messageModel } from "../models/message.model.js";
import { userModel } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { options } from "../utils/features.js";

const getAdminData=async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            admin:true,
        })
    } catch (err) {
        return res.json({success:false, message: err.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});

        const data = await Promise.all(users.map(async ({ _id, name, username, avatar }) => {
            const [groups, friends] = await Promise.all([
                chatModel.countDocuments({ members: _id, groupChat: true }),
                chatModel.countDocuments({ members: _id, groupChat: false })
            ])
            return {
                _id,
                name,
                username,
                avatar: avatar?.url,
                groups,
                friends,
            };
        }));

        return res.json({
            success: true,
            message: "All users retrieved successfully",
            data,
        });
    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
        });
    }
};

const getAllChats = async (req, res) => {
    try {
        const chats = await chatModel
            .find({})
            .populate("members", "name avatar")
            .populate("creator", "name avatar")

        const data = await Promise.all(chats.map(async ({ _id, name, creator, members, avatar }) => {
            const messages = await messageModel.countDocuments({ chatId: _id })
            return {
                _id,
                name,
                creator: {
                    _id: creator?._id,
                    name: creator?.name,
                    avatar: creator?.avatar?.url
                },
                members: members.map(({ _id, name, avatar }) => {
                    return {
                        _id,
                        name,
                        avatar: avatar?.url
                    }
                }),
                messages,
                avatar: avatar?.url,
                totalMembers: messages.length

            }
        }))
        return res.json({
            success: true,
            message: "All Chats retrieved successfully",
            data
        })
    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}

const getAllMessages = async (req, res) => {
    try {
        const messages = await messageModel.find({})
            .populate("sender", "name avatar")
            .populate("chatId", "groupChat")

        const data = messages.map(({ _id, sender, chatId, content, createdAt, attachments }) => {
            return {
                _id,
                content,
                attachments,
                groupChat: chatId.groupChat,
                chatId: chatId._id,
                createdAt,
                sender: {
                    _id: sender._id,
                    name: sender.name,
                    avatar: sender.avatar?.url

                },

            }
        })
        return res.json({
            success: true,
            message: "All messages retrieved successfully",
            data
        })
    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}

const getDashboardStats = async (req, res) => {
    try {
        const [groupCount, userCount, messageCount, chatCount] = await Promise.all([
            chatModel.countDocuments({ groupChat: true }),
            userModel.countDocuments(),
            messageModel.countDocuments(),
            chatModel.countDocuments()
        ])

        const today = new Date()
        const last7Days = today.getDate() - 7

        const last7DaysMessages = await messageModel.find({
            createdAt: {
                $gte: last7Days,
                $lte: today
            }
        }).select("createdAt")

        const messages = new Array(7).fill(0)
        const dayInMilliseconds = 1000 * 60 * 60 * 24

        last7DaysMessages.forEach(message => {
            const apporx = (today.getTime() - message.createdAt.getTime()) / dayInMilliseconds
            const index = 6 - Math.floor(apporx)
            messages[index]++
        })

        const stats = {
            groupCount,
            userCount,
            messageCount,
            chatCount,
            messagesChat: messages
        }
        return res.json({
            success: true,
            stats
        })

    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}

const verifyAdmin = async (req, res) => {
    try {
        const { secretkey } = req.body
        const key = process.env.ADMIN_SECRET_KEY || "admin"
        const isMatch = secretkey === key
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "unauthorized user"
            })
        }

        const token = jwt.sign(key, process.env.JWT_SECRET)
        console.log(token)
        res.cookie("admin", token, { ...options, maxAge: 1000 * 60 * 60 })
        return res.status(200).json({   
            success:true,
            message: "Admin Logged In Successfully",

        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const logout = (req, res) => {
    try {
        res.cookie("admin","",{...options, maxAge:0})
        return res.json({
            success:true,
            message: "Admin Logout Successfully"
        })
    } catch (err) {
        return res.json({success:false, message:err.message})
    }
}
export {
    getAdminData,
    getAllChats,
    getAllMessages,
    getAllUsers,
    getDashboardStats,
    verifyAdmin,
    logout
};

