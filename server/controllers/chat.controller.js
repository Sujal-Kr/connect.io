import { ALERT, NEW_ATTACHMENTS, NEW_MESSAGE, NEW_MESSAGE_ALERT, REFETCH_CHATS } from "../constants/events.js"
import { chatModel } from "../models/chat.model.js"
import { messageModel } from "../models/message.model.js"
import { userModel } from "../models/user.model.js"
import { emitEvent, uploadToCloud } from "../utils/features.js"

const getMyChats = async (req, res) => {

    try {
        const chats = await chatModel.find({
            members: req._id
        }).populate('members', "avatar name")

        return res.status(200).json({
            success: true,
            message: "Chat retreived successfully",
            chats
        })
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

const getMyGroupChats = async (req, res) => {
    try {
        const chats = await chatModel.find({
            members: req._id,
            creator: req._id,
            groupChat: true
        }).populate('members', "avatar name")

        return res.status(200).json({
            success: true,
            message: "Group chat retreived successfully",
            groups: chats
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

const createGroupChat = async (req, res) => {
    try {
        const { name, members } = req.body

        if (members.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Group must have at least 3 members"
            })
        }
        const allMembers = [...members, req._id]

        const group = await chatModel.create({
            name,
            groupChat: true,
            creator: req._id,
            members: allMembers
        })
        emitEvent(req, ALERT, allMembers, { conetent: `Created Group ${group.name}`, chatId: group.chatId })
        emitEvent(req, REFETCH_CHATS, allMembers)

        return res.status(201).json({
            success: true,
            message: `Created Group ${group.name}`,
            data: group
        })
    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ success: false, message: err.message })
    }
}

const addMembers = async (req, res) => {
    try {
        const { chatId, members } = req.body
        const chat = await chatModel.findById(chatId)

        if (!members || members.length < 1) {

            return res.status(400).json({
                success: false,
                message: "Please provide members"
            });
        }

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found! "
            })
        }
        if (!chat.groupChat) {
            return res.status(400).json({
                success: false,
                message: "This is not a group chat "
            })
        }
        if (chat.creator.toString() !== req._id.toString()) {
            return res.status(404).json({
                success: false,
                message: "Unauthorized Operation"
            })
        }
        if (members.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Groups members limit reached"
            })
        }
        const allNewMembersPromise = members.map(id => userModel.findById(id, "name"))
        const allNewMembers = await Promise.all(allNewMembersPromise)
        const uniqueMembers = allNewMembers.filter(member => !chat.members.includes(member._id.toString()))
        chat.members.push(...uniqueMembers.map(member => member._id))
        const allUsersName = members.map(member => member.name).join(',')

        await chat.save()

        emitEvent(req, ALERT, chat.members, `${allUsersName} has been added to the group`)
        emitEvent(req, REFETCH_CHATS, chat.members)
        console.log(allUsersName)
        return res.json({
            success: true,
            message: "Group members added successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }


}

const removeMember = async (req, res) => {
    try {

        const { chatId, member } = req.body
       
        const [chat, user] = await Promise.all([chatModel.findById(chatId), userModel.findById(member, "name")])
        if (!chat) {
            return res.status(400).json({
                success: false,
                message: "Chat not found"
            })
        }
        if (!member) {
            return res.status(400).json({
                success: false,
                message: "user dose not exit"
            })
        }
        if (chat.members.length <= 3) {
            return res.status(400).json({
                success: false,
                message: "Group must have at least 3 members"
            })
        }
        if (chat.creator.toString() !== req._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized Operation"
            })
        }

        chat.members = chat.members.filter(member => member.toString() !== user._id.toString())


        await chat.save()
        emitEvent(req, ALERT, chat.members, `${user.name} has been kicked out`)

        emitEvent(req, REFETCH_CHATS, chat.members)

        return res.status(200).json({
            success: true,
            message: `${user.name} has been kicked out`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const leaveGroup = async (req, res) => {
    const chatId = req.params.id

    const chat = await chatModel.findById(chatId)
    if (!chat) {
        return res.status(404).json({
            sucess: false,
            message: "Group does not exist"
        })
    }
    if (!chat.groupChat) {
        return res.status(404).json({
            sucess: false,
            message: "Not a group chat"
        })
    }
    chat.members = chat.members.filter(member => member.toString() !== req._id.toString())
    console.log(chat.members)
    if (chat.creator.toString() !== req._id.toString()) {
        chat.creator = chat.members[0]
    }

    const user = await userModel.findById(req._id, "name")
    await chat.save()
    emitEvent(req, ALERT, chat.members, `${user} has left the chat `)

    return res.json({
        success: true,
        message: `${user} has left the chat`
    })

}
const sendAttachemts = async (req, res) => {

    try {
        const { chatId } = req.body
        const chat = await chatModel.findById(chatId)
        const user = await userModel.findById(req._Id, "name")

        if (!chat) {
            return res.json({
                success: false,
                message: "Chat does not exist",
            })
        }
        const files = req.files || []

        if (files.length < 1) {
            return res.status(404).json({
                success: false,
                message: "No files found",
            })
        }


        const result = await uploadToCloud(files)

        const message = await messageModel.create({
            sender: req._id,
            attachments: result,
            chatId
        })

        const realtimeMessage = {
            ...message,
            sender: {
                _id: req._id,
                name: user?.name
            },
            attachments: result.map((item) => ({ url: item.url })),
        }
        console.log(chat)
        emitEvent(req, NEW_MESSAGE, chat.members, {
            message: realtimeMessage,
            chatId
        })
        emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId })

        return res.status(200).json({
            success: true,
            message: "Sent attachments",
            data: message
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

const getChatDetails = async (req, res) => {
    try {
        if (req.query.populate == 'true') {
            console.log(req.query)
            console.log("populate")
            const chat = await chatModel.findById(req.params.id)
                .populate("members", "name avatar")
                .lean()

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Chat not found",
                })
            }
            chat.members = chat.members.map(({ _id, name, avatar }) => {
                return {
                    _id,
                    name,
                    avatar: avatar.url
                }
            })

            return res.status(200).json({
                success: true,
                message: "chat retrived",
                chat
            })

        } else {
            const chat = await chatModel.findById(req.params.id)
            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Chat not found",
                })
            }
            return res.status(200).json({
                success: true,
                message: "chat retrived",
                chat
            })
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const renameGroup = async (req, res) => {
    try {
        const { groupName } = req.body
        // console.log(groupName)
        const chat = await chatModel.findById(req.params.id)
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            })
        }
        if (!chat.groupChat) {
            return res.status(404).json({
                success: false,
                message: "Not a group chat",
            })
        }
        if (chat.creator.toString() !== req._id.toString()) {
            return res.status(404).json({
                success: false,
                message: "Unauthorized Operation",
            })
        }

        chat.name = groupName

        await chat.save()
        // console.log(chat.members)
        emitEvent(req, ALERT, chat.members, `Group renamed to ${groupName}`)
        emitEvent(req, REFETCH_CHATS, chat.members, `Group renamed to ${groupName}`)

        return res.status(200).json({
            success: true,
            message: `Group renamed to ${groupName}`,
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }

}

const deleteChat = async (req, res) => {

    try {
        const chat = await chatModel.findById(req.params.id)

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            })
        }

        if (chat.groupChat && chat.creator.toString() !== req._id.toString()) {

            return res.status(404).json({
                success: false,
                message: "Unauthorized Operation",
            })
        }
        if (!chat.groupChat && !chat.members.includes(req._id.toString())) {
            return res.json({
                success: false,
                message: "Unauthorized Operation",
            })
        }
        const messages = await messageModel.find({
            chatId: req.params.id
        })
        messages.forEach(async (message) => {
            const { attachments } = message
            for (const item of attachments) {
                // delete the file from cloudinary
            }

        })
        await messageModel.deleteMany({ chatId: req.params.id })
        await chatModel.findByIdAndDelete(req.params.id)
        emitEvent(req, REFETCH_CHATS, chat.members,)
        return res.json({
            success: true,
            message: "Chat has been deleted",
        })
    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
        })
    }
}

const getMessages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const chat = await chatModel.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        const messages = await messageModel
            .find({ chatId: req.params.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("sender", "name");

        const count = await messageModel.countDocuments({ chatId: req.params.id });
        const total = Math.ceil(count / limit);

        // emitEvent(req, REFETCH_CHATS, chat.members);

        return res.status(200).json({
            success: true,
            message: "All messages have been received",
            data: messages,
            totalPages: total,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


export {
    addMembers,
    createGroupChat,
    getMyChats,
    getMyGroupChats,
    removeMember,
    leaveGroup,
    sendAttachemts,
    getChatDetails,
    renameGroup,
    deleteChat,
    getMessages
}

