
import ShopSchedule from "../model/shopScheduleModel.js"
import TimeSlot from "../model/timeslotModel.js"
import { errorHandler } from "../Utils/error.js"
import moment from "moment"



export const addTimeSlot = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(401,"You are not allowed to add a timeslot"))
    }

    const {startTime,endTime} = req.body

    try
    {

        const newTimeSlot = new TimeSlot({
            startTime,
            endTime,
            isRecurring:true
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


export const getTimeSlotsForDate = async (req,res,next) => {

    try
    {
        const {appointmentDate} = req.body

        const schedule = await ShopSchedule.findOne({})

        if(!schedule || !schedule.isOpened)
        {
            return next(errorHandler(400,"Shop is closed"))
        }

        const dayOfWeek = moment(appointmentDate).format("dddd")

        if(!schedule.daysOpen.includes(dayOfWeek))
        {
            return next(errorHandler(400,"Shop is closed on this day"))
        }

        const recurringSlots = await TimeSlot.find({isRecurring:true})

        const dateSlots = []

        for(const slot of recurringSlots)
        {

            const existingSlot = await TimeSlot.create({
                startTime:slot.startTime,
                endTime:slot.endTime,
                appointmentDate: moment(appointmentDate).startOf("day").toDate(),
            })

            if(!existingSlot)
            {

                const dateSlot = await TimeSlot.create({
                    startTime:slot.startTime,
                    endTime:slot.endTime,
                    appointmentDate:moment(appointmentDate).startOf("day").toDate(),
                })

                dateSlots.push(dateSlot)

            }
            else
            {
                dateSlots.push(existingSlot)
            }

        }

        res.status(200).json({success:true ,dateSlots})

    }
    catch(error)
    {
        next(error)
    }

}


export const getAvailableTimeslots = async (req,res,next) => {

    try
    {
        const {appointmentDate} = req.body

        const availableSlots = await TimeSlot.find({
            appointmentDate:moment(appointmentDate).startOf("day").toDate(),
            isBooked:false,
            isActive:true
        })

        res.status(200).json({success:true , availableSlots})

    }
    catch(error)
    {
        next(error)
    }
}


export const getTimeSlots = async (req,res,next) => {

    try
    {
        const timeSlots = await TimeSlot.find({isRecurring:true}).sort({_id:-1})

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

    const timeSlot = await TimeSlot.findById(timeslotId)

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

    const timeSlot = await TimeSlot.findById(timeslotId)

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

