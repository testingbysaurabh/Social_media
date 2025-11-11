const express = require("express")
const router = express.Router()
const nodemailer = require("nodemailer");
const { OTP } = require("../Models/OTP")
const { VerfiedMail } = require("../Models/VerifiedMail");
const { otpLimiter } = require("../Middlewares/OtpMiddleware")




const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.APP_PASSWORD
    }
})

function generateOTP() {
    const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, "0")
    return otp
}



router.post("/otp/send-otp", async (req, res) => {

    try {
        const { email } = req.body
        const foundUser = await VerfiedMail.findOne({ mail: email })
        if (foundUser) {
            throw new Error("Mail Already Verified")
        }
        const otp = generateOTP()
        await OTP.create({ mail: email, otp, createdAt: Date.now() })

        await transporter.sendMail({
            from: '"Social_media" <testingbysaurabh@gmail.com>',
            to: email,
            subject: "Your OTP Code",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 450px; margin: auto; padding: 20px; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
                <h2 style="color: #ffffff; margin: 0; font-size: 22px;">Social_Media Verification</h2>
            </div>
            <div style="padding: 20px;">
                <p style="font-size: 15px; color: #333;">Hi,</p>
                <p style="font-size: 15px; color: #333;">
                Your One-Time Password (OTP) is:
                </p>
                <h3 style="text-align: center; background: #f0f8ff; color: #2575fc; padding: 12px; border-radius: 6px; font-size: 24px; letter-spacing: 2px;">
                ${otp}
                </h3>
                <p style="font-size: 13px; color: #666; margin-top: 15px;">
                This code is valid for 2 minutes. Do not share it with anyone.
                </p>
                <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
                &copy; ${new Date().getFullYear()} Dosti. All rights reserved.
                </p>
            </div>
            </div>
        `
        });

        res.status(200).json({ msg: "done" })
    } catch (error) {
        // console.log(error.message)
        res.status(400).json({ error: error.message })
    }

})


router.post("/otp/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body
        const foundUser = await VerfiedMail.findOne({ mail: email })
        if (foundUser) {
            throw new Error("Mail Already Verified")
        }
        const foundOtp = await OTP.findOne({
            $and: [
                { mail: email },
                { otp: otp }
            ]
        })
        if (!foundOtp) {
            throw new Error("Verification Failed")
        }
        await VerfiedMail.create({ mail: email })
        res.status(201).json({ msg: "done" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})








module.exports = {
    OtpRouter: router
}