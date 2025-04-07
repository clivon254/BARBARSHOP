

import mongoose from "mongoose"




const appointmentSchema = new mongoose.Schema(
    {
        appointNumber:{type:String , required:true},

        customer:{type:mongoose.Schema.Types.ObjectId , ref:'User'},

        barbar:{type:mongoose.Schema.Types.ObjectId , ref:'Barbar'},

        services:[{type:mongoose.Schema.Types.ObjectId , ref:'Service'}],

        timeslot:{type:mongoose.Schema.Types.ObjectId , ref:'TimeSlot'},

        notes:{type:String , required:true},

        paid:{type:String , default:false},

        status:{type:String , default:"pending", enum:["pending","confirmed","completed","cancelled","attended"]}
    },
    {timestamps:true}
)

const Appointment = mongoose.model('Appointment', appointmentSchema)


export default Appointment