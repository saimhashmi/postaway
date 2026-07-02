// Import the necessary modules here
import nodemailer from "nodemailer";
import { stdin, stdout } from "process";
import readline from "readline";

const Solution = () => {
	// Write your code here
	async function sendEmail() {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "codingninjas2k16@gmail.com",
				pass: "slwvvlczduktvhdj",
			},
		});

		const emailInterface = readline.createInterface({
			input: stdin,
			output: stdout,
		});

		emailInterface.question("please enter you mail", (mailID) => {
			const mailOptions = {
				from: "codingninjas2k16@gmail.com",
				to: mailID,
				subject: "Coding Ninjas",
				text: "The world has enough coders; be a coding ninja!",
			};

			try {
				transporter.sendMail(mailOptions);
				console.log("Email sent successfully");
			} catch (err) {
				console.log(err);
			}

			emailInterface.close();
		});
	}

	sendEmail();
};

export default Solution;
