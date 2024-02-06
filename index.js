import express from 'express';
import DBConnection from './DB/connection.js';



const app = express();

/* CONNECTION */
await DBConnection();
/* PARSING */
app.use(express.json());

/* ROUTES */


/* NOT FOUND URL */
app.use('**', (req, res, next) => {
    return next(new Error(`This API Doesn't exist`, { cause: 404 }))
})

/* GLOBAL ERROR HANDLER */
app.use((error, req, res, next) => {

    return res.status(error.cause || 500)
        .json({ success: false, message: error.message, stack: error.stack })

})

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`You're Listening on Port ${port}`);
})