
import TimeSlot from "../model/timeslotModel.js"
import { errorHandler } from "../Utils/error.js"



export const addTimeSlot = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(401,"You are not allowed to add a timeslot"))
    }

    const {isBooked,isActive} = req.body

    try
    {
        const newTimeSlot = new TimeSlot({
            isBooked,isActive
        })

        await newTimeSlot.save()

        res.status(200).json({success:true , newTimeSlot})
    }
    catch(error)
    {
        next(error)
    }

}

export const getTimeSlot = async (req,res,next) => {

    const {timeslotId} =  req.params
    
    try
    {
        const timeSlot = await TimeSlot.findById(timeslotId)

        if(!timeSlot)
        {
            return next(errorHandler(404,"timeslot not found"))
        }

        res.status(200).json({success:true , timeSlot})

    }
    catch(error)
    {
        next(error)
    }

}

export const getTimeSlots = async (req,res,next) => {

    try
    {
        const timeSlots = await TimeSlot.find({}).sort({_id:-1})

        res.status(200).json({success:true, timeSlots})
        
    }
    catch(error)
    {
        next(error)
    }

}


export const updateTimeSlot = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403,"You are not allowed to update slot"))
    }

    const {timeslotId} = req.params

    const timeSlot = await findById(timeslotId)

    if(!timeSlot)
    {
        return next(errorHandler(404,"timeslot not found"))
    }

    try
    {

        const updatedTimeSlot = await TimeSlot.findByIdAndUpdate(
            timeslotId,
            {
                $set:{
                    startTime:req.body.startTime,
                    endTime:req.body.endTime,
                    isBooked:req.body.isBooked,
                    isActive:req.body.isActive
                }
            },
            {new:true}
        )

        res.status(200).json({success:true , updatedTimeSlot})

    }
    catch(error)
    {
        next(error)
    }

}

export const deleteTimeSlot = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403,"You are not allowed to delete slot"))
    }

    const {timeslotId} = req.params

    const timeSlot = await findById(timeslotId)

    if(!timeSlot)
    {
        return next(errorHandler(404,"timeslot not found"))
    }
    
    try
    {
        await TimeSlot.findByIdAndDelete(timeslotId)

        res.status(200).json({success:true , message:'timeslot deleted successfully'})

    }
    catch(error)
    {
        next(error)
    }

}

