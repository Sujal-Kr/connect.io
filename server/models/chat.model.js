import mongoose, { Schema, model, Types } from "mongoose";

const chatSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    groupChat: {
        type: Boolean,
        default: false,
    },
    creator: {
        type: Types.ObjectId,
        ref: 'user'
    },
    members: [{
        type: Types.ObjectId,
        ref: 'user',
    }],
    avatar: {
        type: {
            url: String,
            public_id: String
        },
        default: {
            url: "https://avatars.githubusercontent.com/u/18866697",
            public_id: "worriedly.mpg"
        }
    }
}, { timestamps: true });

export const chatModel = mongoose.models.chat || model('chat', chatSchema);
