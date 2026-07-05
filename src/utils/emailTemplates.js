export const verificationEmail = (username, verificationUrl) => {
	return {
		subject: "Welcome to Postaway",
		html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #333333; text-align: center;">Welcome to Our Platform Postaway!</h2>
                <p>Hi ${username},</p>
                <p>Thank you for signing up. Please click the button below to verify your email address and activate your account:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" 
                    style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Verify Email Address
                    </a>
                </div>
                
                <p style="color: #666666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="font-size: 12px; word-break: break-all;"><a href="${verificationUrl}" style="color: #4CAF50;">Verify Email</a></p>

                <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                <p style="font-size: 12px; color: #999999; text-align: center;">If you did not create an account, no further action is required.</p>
            </div>
        `,
	};
};
