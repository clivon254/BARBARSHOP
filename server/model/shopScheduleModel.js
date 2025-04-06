
import mongoose from "mongoose"


const shopScheduleSchema = new mongoose.Schema(
    {
        openingTime:{type:String , required:true},

        closingTime:{type:String , required:true},

        daysOpen:{type:Array , required:true}
    },
    {
        timestamps:true
    })

const ShopSchedule = mongoose.model('ShopSchedule', shopScheduleSchema)


export default ShopSchedule