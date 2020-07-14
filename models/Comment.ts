import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    user_id: string,
    post_id: string,
    username: string,
    comment: string,
    created_at: string
}

const schema: Schema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    post_id: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IComment>('Comment', schema);