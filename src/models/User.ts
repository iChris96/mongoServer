import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        lowercase: true
    }
})

export default model('User', UserSchema);