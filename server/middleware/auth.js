import jwt from "jsonwebtoken"
import { ADMIN } from "../constants/data.js"
import { userModel } from "../models/user.model.js"
import cookieParser from "cookie-parser"

export const protectRoute = async (req, res, next) => {
    const secret = process.env.JWT_SECRET
    try {
        const token = req.cookies?.token

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "user not logged in"
            })
        }
        const payload = jwt.verify(token, secret)
        if (!payload) {
            return res.status(401).json({
                success: false,
                message: "unauthorized user"
            })
        }
        req._id = payload._id

        next()
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


export const adminRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.admin
        console.log("token", token)
        if (!token) {
            return res.json({ success: false, message: "admin not logged in" })
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET)
        if (!payload) {
            return res.json({
                success: false,
                message: "unauthorized access"
            })
        }
        const isMatch = payload === process.env.ADMIN_SECRET_KEY || "admin"
        if (!isMatch) {
            return res.json({ success: false, message: "unauthorized access" })
        }
        next()
    } catch (err) {
        return res.json({
            success: false,
            message: err.message
        })
    }
}


export const isAuthorized = async (req, res, next) => {
    const token = req.cookies?.token
    if (!token) {
        return res.json({
            success: false,
            message: "User not logged in"
        })
    }
    const _id = req._id

    next()
}


export const socketAuthentication = async (socket, next) => {
    try {
        const cookie = cookieParser.JSONCookies(socket.handshake.headers.cookie)
        if (!cookie) return next(new Error("user not logged in"))
        const token = cookie.split("=")[1]
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        if (!payload) return next(new Error("Couldn't verify token"))
        const user = await userModel.findById(payload._id)
        if (!user) return next(new Error("User not found"))
        socket.user = user._id
        next()
    } catch (error) {
        console.error(error.message)
        return next(new Error(error))
    }
}