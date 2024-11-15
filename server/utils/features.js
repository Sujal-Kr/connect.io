import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";

export const options = {
    maxAge: 1000 * 24 * 60 * 60 * 2,
    secure: true,
    httpOnly: true,
}

export const connectDb = () => {
    const uri = process.env.DB_URI

    mongoose.connect(uri).then((db) => {
        console.log("Connected to database")
    }).catch((error) => {
        console.error(error.message)
    })
}

export const sendToken = (res, user, code, message) => {

    const secret = process.env.JWT_SECRET
    const token = jwt.sign({ _id: user._id }, secret)

    res.cookie("token", token, options)

    return res.status(code).json({
        success: true,
        message,
        user,
    })
}

export const uploadToCloud = async (files) => {
    try {
        const promises = files?.map(file => {
            
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(file.path, { resource_type: "auto", public_id: uuid() }, (err, result) => {
                    if (err) {
                        console.error("Error uploading file:", file.path, err.message);
                        return reject(err);
                    }
                    resolve(result);
                });
            });
        });
        const results = await Promise.all(promises);
        const formattedResult = results.map(result => ({
            public_id: result.public_id,
            url: result.secure_url
        }));
        return formattedResult
    } catch (err) {
        throw new Error("Failed to upload to cloud" + err.message);
    }
};


export const emitEvent = (req, event, users, data) => {
    console.log("Event emiting", event)
}