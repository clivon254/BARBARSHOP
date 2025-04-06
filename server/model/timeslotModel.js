

import mongoose from "mongoose"



const timeslotSchema = new mongoose.Schema(
    {
        startTime:{type:String , required:true},

        endTime:{type:String ,required:true},

        appointmentDate:{type:Date},

        isBooked:{type:Boolean , default:false},

        isActive:{type:Boolean , default:true},

        isRecurring:{type:Boolean ,default:false}
    },
    {
        timestamps:true
    })

const TimeSlot = mongoose.model('TimeSlot', timeslotSchema)



export default TimeSlot