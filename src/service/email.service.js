// Import the necessary modules here
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { EmailDeliveryError } from "../utils/errors.js";
import { text } from "express";
dotenv.config();

// SMTP Server Configuration
const smtpConfig = {
	service: "gmail",
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASS,
	},
};

// Create a single, permanent Gmail transporter
const transporter = nodemailer.createTransport(smtpConfig);

export default async function sendEmail(recipientEmail, mailBody) {
	const mailOptions = {
		from: process.env.GMAIL_USER,
		to: recipientEmail,
		subject: mailBody.subject,
		html: mailBody.html,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent successfully");
		return info;
	} catch (error) {
		throw new EmailDeliveryError({
			message: `Alert transmission failed for recipient: ${recipientEmail}`,
			recipient: recipientEmail,
			error: error.message,
		});
	}
}
