import jwt from "jsonwebtoken";
import asyncHandler from "../../utils/AsyncHandler.js";
import Token from "../../DB/models/token.model.js";
import User from "../../DB/models/user.model.js";

const bearerKey = process.env.BEARER_KEY;
const tokenSecret = process.env.TOKEN_SECRET;

export const isAuthenticated = asyncHandler(
    async (req, res, next) => {

        let { token } = req.headers;

        if (!token) return next(new Error(`Credentials are Required`, { cause: 400 }))

        if (!token.startsWith(bearerKey)) return next(new Error(`Invalid Token`, { cause: 401 }))

        token = token.split(bearerKey)[1];

        const DBToken = await Token.findOne({ token });

        if (!DBToken || !DBToken.valid) return next(new Error(`Invalid Token`, { cause: 401 }));

        /* GET USER FROM DATABASE*/
        const { id } = jwt.verify(token, tokenSecret);
        const DBUser = await User.findById(id);

        if (!DBUser) return next(new Error(`This Account doesn't exist anymore`, { cause: 404 }));

        /* Pass user and toke docs to next middleware */
        req.DBUser = DBUser;
        req.DBToken = DBToken;
        next()
    }
)


export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.DBUser.role)) return next(new Error(`You're not Authorized`, { cause: 403 }))
        next()
    }
}