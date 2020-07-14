import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    user_id: string,
    title: string,
    description: string,
    image_name: string,
    created_at: string
}

const schema: Schema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image_name: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IPost>('post', schema);