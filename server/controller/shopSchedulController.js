
import ShopSchedule from "../model/shopScheduleModel.js"
import { errorHandler } from "../Utils/error.js"


export const addShopSchedule = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(403,"You are not allowed to add shopSchedule"))
    }

    const {openingTime,closingTime,daysOpen} = req.body 

    try
    {

        const newShopSchedule = new ShopSchedule({
            openingTime,closingTime
        })

        res.status(200).json({success:true , newShopSchedule})

    }
    catch(error)
    {
        next(error)
    }

}

export const getShopSchedule = async (req,res,next) => {

    try
    {
        const shopSchedule = await shopSchedule.findOne({})

       res.status(200).json({success:true , shopSchedule})

    }
    catch(error)
    {
        next(error)
    }

}

export const updateShopSchedule = async (erq,res,next) => {

    const {openingTime,closingTime,daysOpen} = req.body

    try
    {
        const schedule = await ShopSchedule.findOne({})

        if(!schedule)
        {
            return next(errorHandler(404,"schedule not found"))
        }

        schedule.openingTime = openingTime;

        schedule.closingTime = closingTime;

        schedule.daysOpen = daysOpen;

        res.status(200).json({success:true , schedule})
        
    }
    catch(error)
    {
        next(error)
    }

}