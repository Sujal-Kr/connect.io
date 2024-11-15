import { userSocketIds } from "../app.js"

export const getSocketIds = (users) => {
    try {
        return users.map(user => userSocketIds.get(user.toString()))
    } catch (err) {
        console.error(err.message)
    }

}