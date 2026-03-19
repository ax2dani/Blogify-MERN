const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Harnesses standard production SMTP routing using Environment Variables
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
    });

    const message = {
        from: `"${process.env.FROM_NAME || 'Blogify Support'}" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);

    console.log("-----------------------------------------");
    console.log(`Live Password Reset Email successfully dispatched to: ${options.email}`);
    console.log("-----------------------------------------");
};

module.exports = sendEmail;
