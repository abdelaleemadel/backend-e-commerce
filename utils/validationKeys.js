import Joi from "joi";
const forgetCodeLen = parseInt(process.env.FORGET_CODE);

const validationKeys = {
    name: Joi.string().min(3).max(20),
    email: Joi.string().email(),
    password: Joi.string().min(6).required(),
    gender: Joi.string().valid("male", "female"),
    rePassword: Joi.string().valid(Joi.ref('password')).required(),
    forgetCode: Joi.string().min(forgetCodeLen).max(forgetCodeLen).required()
}

export default validationKeys;