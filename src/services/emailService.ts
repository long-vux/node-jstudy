import nodemailer from 'nodemailer';

interface SendEmailProps {
    toEmail: string;
    subject: string;
    htmlContent: string;
}

// create a transporter object to send emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// send email function
const sendEmail = async ({ toEmail, subject, htmlContent }: SendEmailProps): Promise<void> => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: subject,
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error when sending email', error);
    }
};

export { sendEmail };