import { NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js'
import { chatModel } from '../models/chat.model.js'
import { requestModel } from '../models/request.model.js'
import { userModel } from '../models/user.model.js'
import { emitEvent } from '../utils/features.js'

const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req._id)
        return res.json({ success: true, message: "Data retrieved", user  })

    } catch (err) {
        return res.json({ success: false, message: err.message })
    }

}

const searchUser = async (req, res) => {
    try {
        const { name = "" } = req.query
        const chats = await chatModel.find({ groupChat: false, members: req._id })
        const friends = chats.map(chat => chat.members).flat()
        const others = await userModel.find({
            _id: { $nin: friends },
            name: { $regex: name, $options: "i" }
        })
        
        const data = others.map(({ _id, name, avatar }) => {
            return {
                _id,
                name,
                avatar: avatar?.url
            }
        })

        return res.json({
            success: true,
            message: "Data retrieved",
            users:data
        })
    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}

const  sendRequest = async (req, res) => {
    try {
        const { userId } = req.body
        const request = await requestModel.findOne({
            $or: [
                { sender: req._id, receiver: userId },
                { sender: userId, receiver: req._id }
            ]
        })
        // console.log(request)
        if (request) {
            return res.status(401).json({
                success: false,
                message: "Request allready sent",
            })
        }

        await requestModel.create({
            sender: req._id,
            receiver: userId,
        })
        emitEvent(req, NEW_REQUEST, [userId], "request")

        return res.json({
            success: true,
            message: "Request sent successfully",
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

const acceptRequest = async (req, res) => {
    try {
        const { requestId, accept } = req.body
        const request = await requestModel
            .findById(requestId)
            .populate('sender', 'name')
            .populate('receiver', 'name')
        
        if (!request) {
            return res.json({
                success: false,
                message: "No request found!!"
            })
        }
        if (request.receiver._id.toString() !== req._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Operation"
            })
        }
        if (!accept) {
            await request.deleteOne()
            return res.json({
                success: false,
                message: "Request rejected "
            })
        }

        request.status = 'accepted'
        await request.save()
        const chat = await chatModel.create({
            name: `${request.sender.name}_${request.receiver.name}`,
            members: [request.sender._id, request.receiver._id],
        })
        await request.deleteOne()

        emitEvent(req, REFETCH_CHATS, chat.members)

        return res.json({
            success: true,
            message: "Request accepted successfully",
            sender: request.sender.name
        })
    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
        })
    }
}

const getMyNotifications = async (req, res) => {
    try {
        const requests = await requestModel.find({
            receiver: req._id,
        }).populate("sender", "name avatar")
        
        const notifications = requests.map(({ _id, sender, }) => {
            return {
                _id,
                sender: {
                    _id: sender._id,
                    name: sender.name,
                    avatar: sender.avatar.url
                }
            }
        })

        return res.status(200).json({
            success: true,
            message: "All Notifications",
            notifications
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


const getMyFriends = async (req, res) => {
    try {
        const chatId = req.query.chatid
        const chats = await chatModel
            .find({ members: req._id, groupChat: false })
            .populate("members", "name avatar")


        const friends = chats
            .map(({ members }) => members)
            .flat()
            .filter((member) => req._id.toString() !== member._id.toString())
            .map(({_id,name,avatar})=>{
                return {
                    _id,name,avatar:avatar.url
                }
            })

        if (chatId) {
            const chat = await chatModel.findById(chatId)
            const available = friends.filter(friend => !chat.members.includes(friend))
            return res.json({
                success: true,
                message: "Friends Retrived Succesfully",
                friends: available,
            })
        } else {
            return res.json({
                success: true,
                message: "Friends Retrived Succesfully",
                friends,
            })
        }
    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }

}
export {
    getUserProfile,
    searchUser,
    acceptRequest,
    sendRequest,
    getMyNotifications,
    getMyFriends
}