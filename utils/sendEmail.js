import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export async function sendEmail({ to, subject, html }) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `"E-Commerce" <${process.env.EMAIL}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        html, // plain text body
        /* html: "<b>Hello world?</b>", */ // html body
    });
    return (info.accepted.length > 0 && info.rejected.length == 0)
}