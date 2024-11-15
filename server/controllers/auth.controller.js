import { userModel } from "../models/user.model.js"
import { options, sendToken, uploadToCloud } from "../utils/features.js"
import bcrypt from 'bcrypt'

//Campare credentials and set Token

export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await userModel.findOne({ username }).select('+password')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Wrong password" })
        }
        sendToken(res, user, 200, `Welcome back ${username}`)
    } catch (err) {
        return res.json({ success: false, message: "Couldn't login! " + err.message })
    }
}


// create a new user and add to cookies 
export const signup = async (req, res, next) => {
    try {
        const { name, username, password, bio } = req.body;
        const file = req.file;
       
        if (!file) {
            return res.status(400).json({ success: false, message: "Avatar is missing" });
        }
        const result=await uploadToCloud([file])
        
        const avatar = {
            public_id: result[0].public_id,  
            url: result[0].url
        };

        const user = await userModel.create({
            name,
            username,
            password,
            bio,
            avatar
        });

        return sendToken(res, user, 201, "User created successfully");

    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};


// Delete the token cookie 
export const logout = async (req, res) => {

    try {
        res.cookie('token', '', { ...options, maxAge: 0 })
        return res.status(200).json({
            success: true,
        })
    } catch (err) {
        return res.staus(500).json({
            success: false,
            message: err.message
        })
    }
}
