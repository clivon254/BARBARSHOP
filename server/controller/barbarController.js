
import Barbar from "../model/barbarModel.js"
import User from "../model/userModel.js"
import { errorHandler } from "../Utils/error.js"




export const addBarbar = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403,"You are not to add a barbar"))
    }

    const {userId,specialities,bio} = req.body

    const user = await User.findById(userId)

    if(!user)
    {
        return next(errorHandler(404,"User not found"))
    }

    try
    {
        const newBarbar = new Barbar({
            userId,bio,specialities
        })

        await newBarbar.save()

        res.status(200).json({success:true , newBarbar})

    }
    catch(error)
    {
        next(error)
    }

}


export const getBarbar = async (req,res,next) => {

    const {barbarId} = req.params
    
    try
    {
        const barbar = await Barbar.findById(barbarId)

        if(!barbar)
        {
            return next(errorHandler(404,"Barbar not found"))
        }

        res.status(200).json({success:true , barbar})

    }
    catch(error)
    {
        next(error)
    }

}


export const getBarbars = async (req,res,next) => {

    try
    {
        const barbars = await Barbar.find({}).sort({_id:-1})

        res.status(200).json({success:true , barbars})

    }
    catch(error)
    {
        next(error)
    }

}


export const updateBarbar = async (req,res,next) => {

    if(!req.user.isAdmin && !req.user.id)
    {
        return next(errorHandler(401,"You are not allowed to update the barbar"))
    }

    const {barbarId} = req.params

    const barbar = await Barbar.findById(barbarId)

    if(!barbar)
    {
        return next(errorHandler(404,"barbar not found"))
    }

    try
    {

        const updatedBarbar = await Barbar.findByIdAndUpdate(
            barbarId,
            {
                $set:{
                    userId:req.body.userId,
                    bio:req.body.bio,
                    specialities:req.body.specialities,
                }
            },
            {new:true}
        )

        res.status(200).json({success:true , updatedBarbar})

    }
    catch(error)
    {
        next(error)
    }

}


export const dleteBarbar = async (req,res,next) => {

    if(!req.user.isAdmin && !req.user.id)
    {
        return next(errorHandler(401,"You are not allowed to delete the barbar"))
    }

    const {barbarId} = req.params

    const barbar = await Barbar.findById(barbarId)

    if(!barbar)
    {
        return next(errorHandler(404,"barbar not found"))
    }
    
    try
    {
        await Barbar.findByIdAndDelete(barbarId)

        res.status(200).json({success:true , message:"Barbar deleted successfully"})
    }
    catch(error)
    {
        next(error)
    }

}