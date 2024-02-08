import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

const forgetCode = parseInt(process.env.FORGET_CODE);

const userSchema = new Schema({
    firstName: { type: String, minLength: 3, maxLength: 20, required: true },
    lastName: { type: String, minLength: 3, maxLength: 20, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    activated: { type: Boolean, default: false, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["buyer", "admin", "seller"], default: "buyer" },
    forgetCode: { type: String, minLength: forgetCode, maxLength: forgetCode },
    gender: { type: String, enum: ["male", "female"] }
}, { timestamps: true })

userSchema.pre('save', function () {
    if (this.isModified("password")) {
        //Hash Now
        this.password = bcrypt.hashSync(this.password, parseInt(process.env.SALT_ROUND))
    }
})
const User = model('User', userSchema);
export default User; 