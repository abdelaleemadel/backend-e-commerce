import { Schema, Types, model } from "mongoose";

const tokenSchema = new Schema({
    token: { type: String, required: true, unique: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    valid: { type: Boolean, default: true, required: true }
})


const Token = model(`Token`, tokenSchema);
export default Token;