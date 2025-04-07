

import mongoose from "mongooose"


const paymentSchema = new mongoose.Schema(
    {
        date:{type:String ,required:true},

        trnx_id:{type:String ,required:true},
        
        phone:{type:String ,required:true},

        amount:{type:String ,required:true},
    },
    {
        timestamps:true
    }
)

const Payment = mongoose.model('Payment', paymentSchema)


export default Payment