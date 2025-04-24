const Bull = require("bull");
const nodemailer = require("nodemailer");

const emailQueue = new Bull("email-queue", {
    redis: {
        host: "localhost",
        port: 6379
    }
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "lightclone@gmail.com",
        pass: "-------"
    }
});

emailQueue.process(async (job) => {
    const { email, name } = job.data

    try {
        const mailOptions = {
            from: '"Your App" <noreply@yourapp.com>',
            to: email,
            subject: "Selamat Datang di Aplikasi Kami!",
            html: `
        <h1>Halo ${name}!</h1>
        <p>Terima kasih telah mendaftar di aplikasi kami.</p>
        <p>Kami harap Anda menikmati pengalaman menggunakan layanan kami.</p>
      `,
        }

        // untuk mengirim email sungguhan
        const info = await transporter.sendMail(mailOptions);
        console.log(`[${new Date().toISOString()}] Email sent: ${info.messageId}`);

        console.log(`Sending email to ${email}`);
        console.log(`Email subject: ${mailOptions.subject}`);

        return {
            status: "success",
            message: "Email sent successfully"
        }

    } catch (e) {
        console.log(`Error sending email to ${email}: ${e.message}`);
        throw e;
    }
});

emailQueue.on("completed", (job) => {
    console.log(`Email sent to ${job.data.email}`);
});

emailQueue.on("failed", (job, err) => {
    console.log(`Failed to send email to ${job.data.email}: ${err.message}`);
});

module.exports = emailQueue