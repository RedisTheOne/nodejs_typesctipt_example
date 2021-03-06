import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string,
    password: string,
    email: string
}

const schema: Schema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

export default mongoose.model<IUser>('User', schema);