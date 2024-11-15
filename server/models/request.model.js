import mongoose,{ Schema,  model,Types } from "mongoose";

const requestSchema = new Schema({
    status: {
        type:String,
        default:'pending',
        enum:["pending","rejected","accepted"]
    },
    sender: {
        type: Types.ObjectId,
        ref: 'user',
        required:true
    },
    receiver: {
        type: Types.ObjectId,
        ref: 'user',
        required:true
    }
    
}, { timestamps: true })


export const requestModel = mongoose.models.request || model('request', requestSchema);