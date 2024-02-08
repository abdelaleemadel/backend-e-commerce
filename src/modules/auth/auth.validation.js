import Joi from "joi";
import validationKeys from "../../../utils/validationKeys.js";



export const signUp = Joi.object({
    firstName: validationKeys.name.required(),
    lastName: validationKeys.name.required(),
    password: validationKeys.password,
    rePassword: validationKeys.rePassword,
    email: validationKeys.email.required(),
    gender: validationKeys.gender.required()
}).required()



export const logIn = Joi.object({
    email: validationKeys.email.required(),
    password: validationKeys.password
})

export const forgetCode = Joi.object({
    email: validationKeys.email.required()
}).required()



export const resetPassword = Joi.object({
    email: validationKeys.email.required(),
    forgetCode: validationKeys.forgetCode,
    password: validationKeys.password,
    confirmPassword: validationKeys.rePassword,

}).required()