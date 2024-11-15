import { faker, simpleFaker } from "@faker-js/faker"
import { chatModel } from "../models/chat.model.js"
import { messageModel } from "../models/message.model.js"
import { userModel } from "../models/user.model.js"

const createSimpleChats = async (num) => {
    try {
        const users = await userModel.find().select('_id')
        const promises = []
        for (let i = 0; i < users.length; i++) {
            for (let j = i + 1; j < users.length; j++) {
                promises.push(
                    chatModel.create({
                        name: faker.lorem.words(2),
                        members: [users[i], users[j]]
                    })
                )
            }
        }
        await Promise.all(promises)
        console.log(num + " single chat created")
        process.exit(0)
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

const createGroupChats = async (num) => {
    try {
        const users = await userModel.find().select('_id')
        const promises = []
        for (let i = 0; i < num; i++) {

            const length = simpleFaker.number.int({ min: 3, max: users.length })
            const members = []
            for (let j = 0; j < length; j++) {
                let index = Math.floor(Math.random() * users.length)
                if (!members.includes(users[index])) {
                    members.push(users[index])
                }
            }
            promises.push(
                chatModel.create({
                    name: faker.lorem.words(1),
                    members,
                    groupChat: true,
                    creator: members[0]
                })
            )
        }
        await Promise.all(promises)
        console.log(num + " Group chat created")
        process.exit(1)
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }

}
const createMessages = async (num) => {
    try {

        const users = await userModel.find().select("_id")
        const chats = await chatModel.find().select("_id")
        const promises = []
        for (let i = 0; i < num; i++) {
            const sender = users[Math.floor(Math.random() * users.length)]
            const chat = chats[Math.floor(Math.random() * chats.length)]
            const attachments = []
            promises.push(
                messageModel.create({
                    content: faker.lorem.sentence(),
                    sender,
                    attachments,
                    chatId: chat
                })
            )
        }
        await Promise.all(promises)
        console.log(num + " messages generated")
        process.exit(1)
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}



const createMessagesInChat = async (chatId, num) => {
    try {
        const promises = []

        const {members} = await chatModel.findById(chatId).select('members')
        
        for (let i = 0; i < num; i++) {
            const index = Math.floor(Math.random() * members.length)
            console.log(index)
            promises.push(
                messageModel.create({
                    content: faker.lorem.sentence(),
                    sender: members[index],
                    attachments: [],
                    chatId
                })
            )
        }
        await Promise.all(promises)
        console.log(num + " messages generated in chat " + chatId)
        process.exit(0)
    } catch (err) {
        console.error(err.message)
    }
}

export {
    createGroupChats,
    createMessages,
    createSimpleChats,
    createMessagesInChat
}

