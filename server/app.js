import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http'
import { v2 as cloudinary } from 'cloudinary'
import { v4 as uuid } from 'uuid'
dotenv.config()
import { userRouter } from './router/user.router.js'
import { connectDb } from './utils/features.js';
import { errorMiddleware } from './utils/error.js';
import { chatRouter } from './router/chat.router.js';
import { adminRouter } from './router/admin.router.js';
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from './constants/events.js';
import { getSocketIds } from './lib/helper.js';
import { messageModel } from './models/message.model.js';
import { corsOptions } from './constants/config.js';
import { socketAuthentication } from './middleware/auth.js';


const app = express();
const server = createServer(app)
const io = new Server(server, {
    cors: corsOptions
})
const port = process.env.PORT

connectDb()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})

app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/v1/user', userRouter)
app.use('/api/v1/chat', chatRouter)
app.use('/api/v1/admin', adminRouter)


io.use(socketAuthentication)

export const userSocketIds = new Map()
io.on('connection', (socket) => {

    const user = socket.user

    userSocketIds.set(user._id.toString(), socket.id)
    console.log(userSocketIds)
    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
        try {
            const realtimeMessage = { 
                chatId, 
                content: message, 
                _id: uuid(), 
                sender: { 
                    _id: user._id, 
                    name: user.name 
                }, 
                createdAt: new Date().toISOString() 
            }
            console.log(realtimeMessage)

            const membersSocket = getSocketIds(members)
            const databaseMessage = {
                content: message,
                sender: user._id,
                chatId
            }
            


            io.to(membersSocket).emit(NEW_MESSAGE, {
                chatId,
                message: realtimeMessage
            })

            io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId })
            await messageModel.create(databaseMessage)
        } catch (err) {
            console.log(err.message)
        }
    })

    socket.on('disconnect', () => {
        userSocketIds.delete(user._id.toString())
        console.log('user disconnected')
    })
})

app.use(errorMiddleware)

server.listen(port, () => {
    console.log('listening on port', port);
})


