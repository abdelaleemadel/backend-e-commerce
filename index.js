import express from 'express';
import DBConnection from './DB/connection.js';
import authRouter from './src/modules/auth/auth.router.js';



const app = express();
/* CONNECTION */
await DBConnection();
/* PARSING */
app.use(express.json());

/* ROUTES */
app.use('/auth', authRouter);




/* NOT FOUND URL */
app.use('**', (req, res, next) => {
    return next(new Error(`This API Doesn't exist`, { cause: 404 }))
})


/* GLOBAL ERROR HANDLER */
app.use((error, req, res, next) => {
    if (error.code == 11000) {
        return res.status(409).json({ success: false, message: `This ${Object.keys(error.keyValue)} already exist` })
    }
    if (error.message === "jwt malformed")
        return res.status(400).json({ success: false, message: `This token isn't valid` })

    return res.status(error.cause || 500)
        .json({ success: false, message: error.message, stack: error.stack })

})






const port = process.env.PORT;
app.listen(port, () => {
    console.log(`You're Listening on Port ${port}`);
})