import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import randomstring from 'randomstring';

import User from "../../../DB/models/user.model.js";
import asyncHandler from "../../../utils/AsyncHandler.js";
import Token from "../../../DB/models/token.model.js";
import { forgetCodeHtml, signUpHtml } from "../../../utils/htmlTemplets.js";
import { sendEmail } from "../../../utils/sendEmail.js";

const tokenSecret = process.env.TOKEN_SECRET;

export const signUp = asyncHandler(
    async (req, res, next) => {
        const { rePassword, ...userData } = req.body;


        const user = await User.create(userData)
        /* Create Token for Activation only */
        const token = jwt.sign({ email: user.email }, tokenSecret, { expiresIn: '1d' });
        /* GET THE EMAIL CONTENT */
        const html = signUpHtml({ link: `http://localhost:3000/auth/activate/${token}`, email: user.email, userName: user.firstName });

        const sent = sendEmail({ to: user.email, subject: `E-Commerce Account Activation`, html });

        if (!sent) return next(new Error('Email is incorrect', { cause: 400 }))
        return res.json({ success: true, message: 'An activation email has been sent to your email, please activate it soon' })
    }
)

export const activateAccount = asyncHandler(
    async (req, res, next) => {
        const { token } = req.params;

        const { email } = jwt.verify(token, process.env.TOKEN_SECRET);

        const user = await User.findOneAndUpdate({ email }, { activated: true });
        if (!user) return next(new Error(`This account doesn't exist please signup`, { cause: 404 }));

        if (user.activated) return next(new Error(`This Account is Already Activated, please sign in`, { cause: 400 }))

        res.json({ success: true, message: `You can log in now, we activated your account` })
    }
)

export const logIn = asyncHandler(
    async (req, res, next) => {

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return next(new Error(`This account doesn't exist`, { cause: 404 }));

        if (!user.activated) return next(new Error(`Activate Your Account first`))

        const match = await bcrypt.compare(password, user.password);
        if (!match) return next(new Error(`Invalid Password`, { cause: 401 }))
        console.log(tokenSecret);

        const token = jwt.sign({ email, id: user._id }, tokenSecret);

        await Token.create({ token, user: user._id });

        res.json({ success: true, message: `You have logged in Successfully`, token })
    }
)


export const forgetCode = asyncHandler(
    async (req, res, next) => {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return next(new Error(`Incorrect Email`, { cause: 404 }));

        const forgetCode = randomstring.generate(parseInt(process.env.FORGET_CODE));

        user.forgetCode = forgetCode;
        await user.save();

        const html = forgetCodeHtml({ code: forgetCode, userName: user.firstName })
        const sent = await sendEmail({ to: user.email, subject: `E-Commerce, Forget Password Code`, html });

        if (!sent) return next(new Error(`Incorrect Email`, { cause: 401 }));

        return res.json({ success: true, message: `We have sent a forget code to your email` })
    }
)

export const resetPassword = asyncHandler(
    async (req, res, next) => {
        const { email, forgetCode, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return next(new Error(`Incorrect Email`, { cause: 404 }));


        if (user.forgetCode !== forgetCode) return next(new Error(`Invalid Code`, { cause: 401 }));

        user.password = password;
        user.forgetCode = undefined;
        await user.save();

        await Token.deleteMany({ user: user._id })

        res.json({ success: true, message: `We have reseted you password, you can now log in with your new password` })

    }
)