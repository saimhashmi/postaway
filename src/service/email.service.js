// Import the necessary modules here
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { EmailDeliveryError } from "../utils/errors.js";
import { text } from "express";
import { verificationEmail } from "../utils/emailTemplates.js";
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

export default async function sendEmail(
	username,
	recipientEmail,
	verificationUrl,
) {
	const mailData = verificationEmail(username, verificationUrl);
	const mailOptions = {
		from: process.env.GMAIL_USER,
		to: recipientEmail,
		subject: mailData.subject,
		html: mailData.html,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent successfully");
		return info;
	} catch (error) {
		throw new EmailDeliveryError(
			`Alert transmission failed for recipient: ${toEmail}`,
			toEmail,
			error.message, // Pass the underlying reason (e.g., "Invalid login", "Quota exceeded")
		);
	}
}
