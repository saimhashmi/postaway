// Shared theme tokens used across all Postaway emails
const theme = {
	brand: "#4F46E5",
	accent: "#10B981",
	textDark: "#111111",
	textBody: "#4B5563",
	textMuted: "#6B7280",
	textFooter: "#9CA3AF",
	bgCard: "#F9FAFB",
	borderCard: "#E5E7EB",
	bgFooter: "#F3F4F6",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
};

// Shared wrapper so every email has the same header/footer shell
const emailShell = (bodyHtml) => `
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; font-family: ${theme.fontFamily}; color: ${theme.textDark}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid ${theme.borderCard};">

        <!-- HEADER -->
        <div style="background-color: ${theme.brand}; padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">Postaway</h1>
        </div>

        <!-- CONTENT -->
        <div style="padding: 40px 30px;">
            ${bodyHtml}
        </div>

        <!-- FOOTER -->
        <div style="background-color: ${theme.bgFooter}; padding: 24px; text-align: center; font-size: 12px; color: ${theme.textFooter}; border-top: 1px solid ${theme.borderCard};">
            <p style="margin: 0 0 8px 0;">You received this email because you have an account on Postaway.</p>
            <p style="margin: 0 0 8px 0;">&copy; 2026 Postaway, Inc. | 123 Tech Avenue, San Francisco, CA</p>
            <p style="margin: 0;"><a href="localhost:3000/settings/notifications" style="color: ${theme.brand}; text-decoration: none;">Manage Notifications</a> &bull; <a href="[Unsubscribe_URL]" style="color: ${theme.brand}; text-decoration: none;">Unsubscribe</a></p>
        </div>

    </div>
`;

export const verificationEmail = (username, verificationUrl) => {
	return {
		subject: "Verify your email for Postaway",
		html: emailShell(`
            <h2 style="font-size: 22px; color: ${theme.textDark}; margin-top: 0; margin-bottom: 20px;">Verify your email, ${username} 📧</h2>
            <p style="font-size: 16px; line-height: 1.6; color: ${theme.textBody}; margin-bottom: 24px;">Thanks for signing up for Postaway. Please confirm this is your email address by clicking the button below:</p>

            <div style="text-align: center; margin: 35px 0;">
                <a href="${verificationUrl}" style="background-color: ${theme.accent}; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 16px; font-weight: 600; border-radius: 6px; display: inline-block; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">Verify Email Address</a>
            </div>

            <p style="font-size: 14px; color: ${theme.textMuted}; margin-bottom: 4px;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="font-size: 12px; word-break: break-all; margin-bottom: 24px;"><a href="${verificationUrl}" style="color: ${theme.brand};">${verificationUrl}</a></p>

            <p style="font-size: 14px; line-height: 1.6; color: ${theme.textMuted}; margin-bottom: 0;">If you did not create an account, no further action is required.</p>
        `),
	};
};

export const welcomeEmail = (username) => {
	return {
		subject: "Welcome to Postaway",
		html: emailShell(`
            <h2 style="font-size: 22px; color: ${theme.textDark}; margin-top: 0; margin-bottom: 20px;">Welcome to the community, @${username}! 👋</h2>
            <p style="font-size: 16px; line-height: 1.6; color: ${theme.textBody}; margin-bottom: 24px;">Your account is officially active. We are thrilled to have you join our growing network of creators, thinkers, and builders. You're now ready to share your voice with the world.</p>
            <p style="font-size: 16px; line-height: 1.6; color: ${theme.textBody}; margin-bottom: 24px;">Here are 3 quick steps to get the most out of your feed today:</p>

            <!-- STEP 1 -->
            <div style="background-color: ${theme.bgCard}; border: 1px solid ${theme.borderCard}; border-radius: 6px; padding: 20px; margin-bottom: 16px;">
                <div style="margin-bottom: 8px;">
                    <span style="display: inline-block; background-color: #EEF2F6; color: ${theme.brand}; font-weight: bold; width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 50%; font-size: 14px; margin-right: 8px; vertical-align: middle;">1</span>
                    <span style="font-size: 16px; font-weight: 600; color: ${theme.textDark}; vertical-align: middle;">Complete your profile</span>
                </div>
                <p style="font-size: 14px; color: ${theme.textMuted}; margin: 0 0 0 36px; line-height: 1.4;">Add a profile picture and a short bio so people can find you easily.</p>
            </div>

            <!-- STEP 2 -->
            <div style="background-color: ${theme.bgCard}; border: 1px solid ${theme.borderCard}; border-radius: 6px; padding: 20px; margin-bottom: 16px;">
                <div style="margin-bottom: 8px;">
                    <span style="display: inline-block; background-color: #EEF2F6; color: ${theme.brand}; font-weight: bold; width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 50%; font-size: 14px; margin-right: 8px; vertical-align: middle;">2</span>
                    <span style="font-size: 16px; font-weight: 600; color: ${theme.textDark}; vertical-align: middle;">Publish your first post</span>
                </div>
                <p style="font-size: 14px; color: ${theme.textMuted}; margin: 0 0 0 36px; line-height: 1.4;">Share an idea, an image, or a simple hello using the hashtag #NewHere.</p>
            </div>

            <!-- STEP 3 -->
            <div style="background-color: ${theme.bgCard}; border: 1px solid ${theme.borderCard}; border-radius: 6px; padding: 20px; margin-bottom: 16px;">
                <div style="margin-bottom: 8px;">
                    <span style="display: inline-block; background-color: #EEF2F6; color: ${theme.brand}; font-weight: bold; width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 50%; font-size: 14px; margin-right: 8px; vertical-align: middle;">3</span>
                    <span style="font-size: 16px; font-weight: 600; color: ${theme.textDark}; vertical-align: middle;">Follow 5 creators</span>
                </div>
                <p style="font-size: 14px; color: ${theme.textMuted}; margin: 0 0 0 36px; line-height: 1.4;">Find your people by exploring trending topics and hitting follow.</p>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin: 35px 0;">
                <a href="localhost:3000/dashboard" style="background-color: ${theme.accent}; color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 16px; font-weight: 600; border-radius: 6px; display: inline-block; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">Go to My Feed</a>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: ${theme.textBody}; margin-bottom: 0;">Need any help? Just reply to this email or check out our Support Center. We can't wait to see what you post!</p>
        `),
	};
};

export const otpEmail = (username, OTP) => {
	return {
		subject: "Your Postaway password reset code",
		html: emailShell(`
            <h2 style="font-size: 22px; color: ${theme.textDark}; margin-top: 0; margin-bottom: 20px;">Reset your password, ${username} 🔐</h2>
            <p style="font-size: 16px; line-height: 1.6; color: ${theme.textBody}; margin-bottom: 24px;">We received a request to reset your Postaway password. Use the one-time code below to continue. This code expires shortly, so enter it soon.</p>

            <div style="text-align: center; margin: 30px 0;">
                <span style="background-color: ${theme.bgCard}; border: 1px dashed ${theme.brand}; color: ${theme.brand}; padding: 14px 32px; border-radius: 6px; font-weight: 700; font-size: 24px; letter-spacing: 6px; display: inline-block;">${OTP}</span>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: ${theme.textMuted}; margin-bottom: 0;">If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.</p>
        `),
	};
};
