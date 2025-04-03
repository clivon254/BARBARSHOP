
import mongoose from "mongoose";


const barbarSchema = new mongoose.Schema(
    {
        userId:{type:mongoose.Schema.Types.ObjectId ,ref:'User'},

        specialities:{type:Array , required:true},

        bio:{type:String ,required:true},

    },
    {
        timestamps:true
    })

const Barbar = mongoose.model('Barbar', barbarSchema)


export default Barbar