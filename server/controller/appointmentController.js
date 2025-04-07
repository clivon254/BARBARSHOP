
import Appointment from "../model/appointmentModel.js"
import TimeSlot from "../model/timeslotModel.js"
import { errorHandler } from "../Utils/error.js"
import { generateRandomOrderNumber } from "../Utils/verify.js"





export const bookAppointments = async (req,res,next) => {

    try
    {
        const {customer,barbar,services,timeslot,notes} = req.body

        const timeSlot = await TimeSlot.findById(timeslot)

        if(!timeSlot || timeslot.isBooked || !timeSlot.isActive)
        {
            return next(errorHandler(400,"Timeslot is not availabe"))
        }

        const appointNumber = generateRandomOrderNumber()

        const appointment = await Appointment.create({
            customer,barbar,services,timeslot,notes,appointNumber
        })

        res.status(200).json({success:true , appointment})

    }
    catch(error)
    {
        next(error)
    }

}


export const getAppointment = async (req,res,next) => {

    try
    {
        
        const {appointmentId} = req.params

        const appointment = await appointment.findById(appointmentId).populate("customer barber service timeslot")
        
        if(!appointment)
        {
            return next(errorHandler(404,"Appointment not found"))
        }

        res.status(200).json({success:true , appointment})

    }
    catch(error)
    {
        next(error)
    }

}


export const getAppointments = async (req,res,next) => {

    try
    {
        const appointments = await Appointment.find({}).populate("customer barbar service timeslot").sort({_id:-1})

        res.status(200).json({success:true , appointments})

    }
    catch(error)
    {
        next(error)
    }

}


export const updateAppointments = async (req,res,next) => {

    if(!req.user.id && !req.user.isAdmin)
    {
        return next(errorHandler(404,"You are not allowed to updated the apppointment"))
    }

    const {appointmentId} = req.params

    const appointment = await Appointment.findById(appointmentId)

    if(!appointment)
    {
        return next(errorHandler(404,"Appointment not found"))
    }

    try
    {

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            {
                $set:{
                    status:req.body.status,
                    barber:req.body.barber,
                    customer:req.body.customer,
                    services:req.body.services,
                    timeslot:req.body.timeslot
                }
            },
            {new:true}
        ).populate("customer barber service timeslot");

        res.status(200).json({success:true , updatedAppointment})

    }
    catch(error)
    {
        next(error)
    }

}


export const acceptAppointments = async (req,res,next) => {

    const {appointmentId} = req.params;

    try
    {
        const appointment = await Appointment.findById(appointmentId).populate("timeslot");
        
        if(!appointment)
        {
            return next(errorHandler(404,"Appointment not found"))
        }

        appointment.status = "confirmed"

         // Check if the timeslot is already booked
        if (appointment.timeslot.isBooked) 
        {
            return res.status(400).json({ message: "Timeslot is already booked." });
        }
        
        appointment.timeslot.isBooked = true;

        await appointment.timeslot.save();

        await appointment.save()

        res.status(200).json({success:true , appointment})

    }
    catch(error)
    {
        next(error)
    }

}


export const deleteAppointments = async (req,res,next) => {
   
    if(!req.user.id && !req.user.isAdmin)
    {
        return next(errorHandler(404,"You are not allowed to updated the apppointment"))
    }

    const {appointmentId} = req.params

    const appointment = await Appointment.findById(appointmentId)

    if(!appointment)
    {
        return next(errorHandler(404,"Appointment not found"))
    }

    try
    {
        await Appointment.findByIdAndDelete(appointmentId)

        res.status(200).json({success:true , message:"Appointment deleted successfully"})

    }
    catch(error)
    {
        next(error)
    }

}


export const rescheduleAppointment = async (req,res,next) => {

    try
    {
        const {appointmentId} = req.params 

        const {newTimeslotId} = req.body 

        const appointment = await Appointment.findById(appointmentId).populate("timeslot")

        if(!appointment)
        {
            return next(errorHandler(400,"appointment not found"))
        }

        const newTimeslot = await TimeSlot.findById(newTimeslotId)

        if(!newTimeslot)
        {
            return next(errorHandler(404,"New timeslot not found"))
        }

        if(newTimeslot.isBooked || !newTimeslot.isActive)
        {
            return next(errorHandler(400,"The New timeslot is unavailable"))
        }

        if(appointment.timeslot)
        {
            appointment.timeslot.isBooked = false

            await appointment.timeslot.save()
        }

        appointment.timeslot = newTimeslotId

        await appointment.save()

    }
    catch(error)
    {
        next(error)
    }

}
