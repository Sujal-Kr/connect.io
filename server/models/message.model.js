import mongoose, { Schema, model,Types } from "mongoose";

const messageSchema = new Schema({
    content: String,
    sender: {
        type: Types.ObjectId,
        ref: 'user',
        required: true
    },
    attachments: [{
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    }],
    chatId:{
        type: Types.ObjectId,
        ref:"chat",
        required: true,
    }

}, { timestamps: true })


export const messageModel = mongoose.models.message || model('message', messageSchema);