import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APPPASS,
  },
  tls: {
    rejectUnauthorized: false
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log("Foodiy Nodemailer error:");
        console.log(error.message);
    } else {
        console.log("Foodiy Nodemailer is ready to email");
    }
});

export const sendOtpMail=async (to,otp) => {
    await transporter.sendMail({
        from: `Foodify <${process.env.EMAIL}>`,
        to,
        subject:"Reset Your Password - Foodify",
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <table align="center" width="100%" max-width="600px" style="background: #ffffff; border-radius: 10px; padding: 20px;">
                
                <!-- Header -->
                <tr>
                    <td style="text-align: center;">
                        <h2 style="color: #ff6b00; margin: 0;">🍔 Foodify</h2>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 20px 0;">
                        <h3 style="margin-bottom: 10px;">Reset Your Password</h3>
                        <p style="color: #555;">
                            Use the OTP below to reset your password. This code is valid for 5 minutes.
                        </p>

                        <div style="
                            text-align: center;
                            font-size: 28px;
                            letter-spacing: 6px;
                            font-weight: bold;
                            color: #ff6b00;
                            margin: 20px 0;
                            padding: 15px;
                            background: #fff3e6;
                            border-radius: 8px;
                        ">
                            ${otp}
                        </div>

                        <p style="color: #777; font-size: 14px;">
                            If you didn’t request this, you can safely ignore this email.
                        </p>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="text-align: center; font-size: 12px; color: #aaa; padding-top: 10px;">
                        © ${new Date().getFullYear()} Foodify. All rights reserved.
                    </td>
                </tr>

            </table>
        </div>
        `
    })
}


export const sendDeliveryOtpMail=async (user,otp) => {
    await transporter.sendMail({
        from:process.env.EMAIL,
        to:user.email,
        subject:"Foodify - Delivery OTP",
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <table align="center" width="100%" max-width="600px" style="background: #ffffff; border-radius: 10px; padding: 20px;">
                
                <!-- Header -->
                <tr>
                    <td style="text-align: center;">
                        <h2 style="color: #ff6b00; margin: 0;">🍔 Foodify</h2>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 20px 0;">
                        <h3 style="margin-bottom: 10px;">Reset Your Password</h3>
                        <p style="color: #555;">
                            Use the OTP below to reset your password. This code is valid for 5 minutes.
                        </p>

                        <div style="
                            text-align: center;
                            font-size: 28px;
                            letter-spacing: 6px;
                            font-weight: bold;
                            color: #ff6b00;
                            margin: 20px 0;
                            padding: 15px;
                            background: #fff3e6;
                            border-radius: 8px;
                        ">
                            ${otp}
                        </div>

                        <p style="color: #777; font-size: 14px;">
                            If you didn’t request this, you can safely ignore this email.
                        </p>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="text-align: center; font-size: 12px; color: #aaa; padding-top: 10px;">
                        © ${new Date().getFullYear()} Foodify. All rights reserved.
                    </td>
                </tr>

            </table>
        </div>
        `
    })
}
