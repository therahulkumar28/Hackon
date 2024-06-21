import nodemailer, { Transporter } from 'nodemailer';

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
}

const transporter: Transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
    const mailOptions: MailOptions = {
        from: 'your-email@gmail.com',
        to,
        subject,
        text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export { sendEmail };
