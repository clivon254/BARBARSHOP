
import User from "../model/userModel.js"
import { errorHandler } from "../Utils/error.js"
import validator from "validator"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"




export const Register = async (req,res,next) => {

    const {email,password,username,phone} = req.body

    if(!email || !password || !username || !phone || email === "" || password === "" || phone === "" || username === "")
    {
        return next(errorHandler(400,"please fill all the feilds"))
    }

    if(!validator.isEmail(email))
    {
        return next(errorHandler(400,"please provide a valid email address"))
    }

    const existingEmail = await User.findOne({email})

    if(existingEmail)
    {
        return next(errorHandler(400,"Email is already registered"))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)

    try
    {
        const newUser = new User({
            username,
            email,
            phone,
            password:hashedPassword
        })

        await newUser.save()

        res.status(200).json({success:true , message:"You have successfully registered"})

    }
    catch(error)
    {
        next(error)
    }

}


export const Login = async (req,res,next) => {

    const {password,email} = req.body

    if(!email || !password || password === "" || email === "")
    {
        return next(errorHandler(400,"please fill all the feilds"))
    }

    if(!validator.isEmail(email))
    {
        return next(errorHandler("Please provide a valid email"))
    }

    try
    {

        const user = await User.findOne({email})

        if(!user)
        {
            return next(errorHandler(404,"User does not exist"))
        }

        const isMatch = await bcryptjs.compare(password ,user.password)

        if(!isMatch)
        {
            return next(errorHandler(401,"The provided password is Invalid"))
        }

        const token = jwt.sign(
            {
                id:user._id,
                isAdmin:user.isAdmin
            },
            process.env.JWT_SECRETE,
            {expiresIn:'12h'}
        )

        const {password:pass , ...rest} = user._doc

        res.status(200).json({success:true , rest ,token})

    }
    catch(error)
    {
        next(error)
    }

}


export const forgotPassword = async (req,res,next) => {

    const {email} = req.body

    if(!email || email === "")
    {
        return next(errorHandler(400,"please provide an email"))
    }

    if(!validator.isEmail(email))
    {
        return next(errorHandler(400,"please provide a valid email"))
    }

    try
    {
        const user = await User.findOne({email})

        if(!user)
        {
            return next(errorHandler(404,"email is provided is not registered"))
        }

        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRETE,
            {expiresIn:'12h'}
        )

        var transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.AUTH_USER,
                pass:process.env.AUTH_PASS
            }
        })

        var mailOptions = {
            from:"BARBAR CUTZ",
            to:user.email,
            subject:"RESET PASSWORD",
            text:`Click on this link to reset your password : http://localhost:5173/reset-password/${token}`
        }

        transporter.sendMail(mailOptions ,(error,info) => {

            if(error)
            {
                console.log(error)
            }
            else
            {
                console.log("Email sent " + info.response)
            }

        })

        res.status(200).json({success:true ,message:"Link has been sent to your email"})
        
    }
    catch(error)
    {
        next(error)
    }

}


export const resetPassword = async (req,res,next) => {

    const {token} = req.params

    const {password,confirmPassword} = req.body

    try
    {
        const decodedToken = jwt.verify(token,process.env.JWT_SECRETE)

        const user = await User.findById(decodedToken.id)

        if(!user)
        {
            return next(errorHandler(400,"user not found"))
        }

        if(password !== confirmPassword)
        {
            return next(errorHandler(400 ,"Passwords do not match"))
        }

        const hashedPassword = bcryptjs.hashSync(password ,10)

        user.password = hashedPassword

        await user.save()

        res.status(200).json({success:true ,message:"Password reset successfuly"})

    }
    catch(error)
    {
        next(error)
    }

}