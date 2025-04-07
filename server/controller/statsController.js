
import Appointment from "../model/appointmentModel.js"
import Barbar from "../model/barbarModel.js"
import Service from "../model/serviceModel.js"
import User from "../model/userModel.js"


export const stats = async (req,res,next) => {

    const {queryDay} = req.query

    try
    {
        const numOfDays = Number(queryDay) || 30

        const currentDate = new Date()

        const startDate = new Date()

        startDate.setDate(currentDate.getDate() - numOfDays)

        
        const totalUsers = await User.find({
            createdAt:{$gte:startDate , $lte:currentDate}
        }).countDocuments()

        
        const totalBarbars = await Barbar.find({}).countDocuments()


        const totalServices = await Service.find({}).countDocuments()


        const appointmentRequests = await Appointment.find({
            createdAt:{$gte:startDate , $lte:currentDate},
            status:"pending"
        }).countDocuments()

        const appointmentAttendeds = await Appointment.find({
            createdAt:{$gte:startDate , $lte:currentDate},
            status:"attended"
        }).countDocuments()

        
        const userStats = await User.aggregate([
            {
                $match:{
                    createdAt:{$gte:startDate , $lte:currentDate}
                },
            },
            {
                $group:{
                    _id:{
                        $dateToString:{format:"%Y-%m-%d", date:"$createdAt"}
                    },
                    Total:{$sum:1}
                }
            },
            {
                $sort:{_id:-1}
            }
        ])


        res.status(200).json({
            success:true,
            totalBarbars,
            totalServices,
            totalUsers,
            appointmentRequests,
            appointmentAttendeds,
            userStats
        })

    }
    catch(error)
    {
        next(error)
    }

}