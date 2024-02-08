import { Router } from "express";
import validate from "../../middlewares/validate.middleware.js";
import * as authSchemas from "./auth.validation.js";
import * as authControllers from "./auth.controller.js";

const router = Router();

router.post('/signup', validate(authSchemas.signUp), authControllers.signUp);

router.get('/activate/:token', authControllers.activateAccount)

router.post('/login', validate(authSchemas.logIn), authControllers.logIn);

router.patch('/forgetcode', validate(authSchemas.forgetCode), authControllers.forgetCode)

router.patch('/resetpassword', validate(authSchemas.resetPassword), authControllers.resetPassword)
export default router;