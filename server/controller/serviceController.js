
import Service from "../model/serviceModel.js"
import { errorHandler } from "../Utils/error.js"


export const addService = async (req,res,next) => {
    
    if(!req.user.isAdmin)
    {
        return next(errorHandler(401,"You are not allowed to add service"))
    }

    const {name,description,price,image} = req.body

    try
    {

        const newService = new Service({
            name,description,price,image
        })

        await newService.save()

        res.status(200).json({success:true , newService})

    }
    catch(error)
    {
        next(error)
    }

}

export const getService = async (req,res,next) => {

    const {serviceId} = req.params

    try
    {
        const service = await Service.findById(serviceId)

        if(!service)
        {
            return next(errorHandler(404,"Service not found"))
        }

        res.status(200).json({success:true , service})

    }
    catch(error)
    {
        next(error)
    }

}

export const getServices = async (req,res,next) => {

    try
    {
        const services = await Service.find({}).sort({_id:-1})

        res.status(200).json({success:true , services})

    }
    catch(error)
    {
        next(error)
    }

}

export const updateService = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(401,"You are not allowed update the service"))
    }

    const {serviceId} = req.params

    const service = await Service.findById(serviceId)

    if(!service)
    {
        return next(errorHandler(404,"service not found"))
    }

    try
    {

        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            {
                $set:{
                    name:req.body.name,
                    description:req.body.description,
                    price:req.body.price,
                    image:req.body.image,
                }
            },
            {new:true}
        )

        res.status(200).json({success:true ,updatedService})

    }
    catch(error)
    {
        next(error)
    }

}

export const deleteService = async (req,res,next) => {

    if(!req.user.isAdmin)
    {
        return next(errorHandler(401,"You are not allowed update the service"))
    }

    const {serviceId} = req.params

    const service = await Service.findById(serviceId)

    if(!service)
    {
        return next(errorHandler(404,"service not found"))
    }
    
    try
    {
        await Service.findByIdAndDelete(serviceId)

        res.status(200).json({success:true , message:"service deleted successfully"})
        
    }
    catch(error)
    {
        next(error)
    }

}