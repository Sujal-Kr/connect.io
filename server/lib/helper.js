import { userSocketIds } from "../app.js"

export const getSocketIds = (users) => {
    console.log(users)
    try {
        return users.map(user => userSocketIds.get(user.toString()))
    } catch (err) {
        console.log("socketId",err.message)
    }

}