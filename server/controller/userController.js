
import User from "../model/userModel.js"
import { errorHandler } from "../Utils/error.js"
import bcryptjs from "bcryptjs"



export const getUser = async (req,res,next) => {

    const {userId} = req.params

    try
    {
        const user = await User.findById(userId)

        if(!user)
        {
            return next(errorHandler(404,"User not found"))
        }

        const {password:pass , ...rest} = user._doc

        res.status(200).json({success:true , rest})

    }
    catch(error)
    {
        next(error)
    }

}


export const getUsers = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(401,"You are not allowed to access the users"))
    }

    try
    {
        const users = await User.find().sort({_id:-1})

        const usersWithoutPassword = users.map((user) => {

            const {password , ...rest} = user._doc

            return rest

        })

        res.status(200).json({success:true , usersWithoutPassword})

    }
    catch(error)
    {
        next(error)
    }

}


export const updateUser = async (req,res,next) => {

    if(!req.user.isAdmin && !req.user.id)
    {
        return next(errorHandler(403,"You are not allowed to update the user"))
    }

    const {userId} = req.params

    const user = await User.findById(userId)

    if(!user)
    {
        return next(errorHandler(404, "User not found"))
    }

    try
    {

        if(req.body.password)
        {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set:{
                    username:req.body.username,
                    email:req.body.email,
                    phone:req.body.phone,
                    isAdmin:req.body.isAdmin,
                    profilePicture:req.body.profilePicture,
                }
            },
            {new:true}
        )

        const {password , ...rest} = updatedUser._doc

        res.status(200).json({success:true , rest})

    }
    catch(error)
    {
        next(error)
    }

}


export const deleteUser = async (req,res,next) => {
   
    if(!req.user.isAdmin && !req.user.id)
    {
        return next(errorHandler(403,"You are not allowed to update the user"))
    }

    const {userId} = req.params

    const user = await User.findById(userId)

    if(!user)
    {
        return next(errorHandler(404, "User not found"))
    }

    try
    {
        await User.findByIdAndDelete(userId)

        res.status(200).json({success:true , message:"User deleted successfuly" })

    }
    catch(error)
    {
        next(error)
    }

}