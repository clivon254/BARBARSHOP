
import axios from "axios"
import Appointment from "../model/appointmentModel.js"
import Service from "../model/serviceModel.js"
import { errorHandler } from "../Utils/error.js"
import Payment from "../model/paymentModel.js"
import axios from "axios"



let clients = []

export const events = (req,res) => {

    res.setHeader('Content-Type','text/event-stream')

    res.setHeader('Cache-Control', 'no-cache')

    res.setHeader('Connection', 'Keep-alive')

    // Add the client to the list 
    clients.push(res)

    // Remove the cient connection is closed
    req.on('close',() => {

        clients = clients.filter(client => client !== res)

    })

}


// send updates to connected clients
const sendEventToClients = (data) => {

    clients.forEach(client => 

        client.write(`data:${JSON.stringify(data)}\n\n`)

    )

}


export const mpesaPrompt = async (req,res,next) => {

    const {appointmentId} = req.params

    const {phoneNumber} = req.body

    const token = req.token
     
    try
    {
        const appointment = await Appointment.findById(appointmentId).populate("services timeslot")

        if(!appointment)
        {
            return next(errorHandler(404,"appointment found"))
        }

        if(appointment.status !== "confirmed")
        {
            return next(errorHandler(400,"the appointment wait for the service first"))
        }

        let totalPrice = 0;

        // Iterate through the services and calculate the total price
        if (appointment.services && appointment.services.length > 0) {
        
            for (const service of appointment.services) 
            {
                // Find the service in the database to get the price.
                const foundService = await Service.findById(service._id);

                if(foundService){
                    totalPrice += foundService.price;
                }

            }

        }

        const phone = phoneNumber.substring(1)

        const date = new Date()

        const timestamp = 
            date.getFullYear() + 
            ("0" + (date.getMonth() + 1)).slice(-2) +
            ("0" + date.getDate()).slice(-2) +
            ("0" + date.getHours()).slice(-2) +
            ("0" + date.getMinutes()).slice(-2) +
            ("0" + date.getSeconds()).slice(-2) 

        const shortCode = process.env.PAYBILL 

        const passKey = process.env.PASS_KEY

        const password = new Buffer.from(shortCode + passKey + timestamp).toString("base64")

        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

        const requestBody = {    
            "BusinessShortCode": shortCode,    
            "Password": password,    
            "Timestamp":timestamp,    
            "TransactionType": "CustomerPayBillOnline",    
            "Amount": totalPrice,    
            "PartyA":`254${phone}`,    
            "PartyB":shortCode,    
            "PhoneNumber":`254${phone}`,    
            "CallBackURL": `https://mydomain.com/paying/callback?appointmentId=${appointment._id}`,    
            "AccountReference":"BARBARSHOP",    
            "TransactionDesc":"Test"
        }

        await axios.post(url,requestBody,
            {headers:{
                "Authorization":`Bearer ${token}`,
                "Content-Type":'application/json'
            }}
        )
        .then((response) => {

            let resData = response.data

            res.status(200).json({success:true , resData , appointment})
        })
        .catch((err) => {

            console.log("stk push error")

            res.status(400).json({success:false , message:`${err.message}`})
        })

    }   
    catch(error)
    {
        next(error)
    }

}



export const callBack = async (req,res,next) => {

    const {appointmentId} = req.query

    try
    {
        const callbackData = req.body

        if(!callbackData.Body.stkCallback.CallbackMetadata)
        {
            console.log(callbackData.Body)

            sendEventToClients({success:true , message:'STK push has been attended to'})

            res.json("ok")
        }
        else
        {
            const body = req.body.Body.stkCallback.CallbackMetadata

            console.log(body)

            const appointment = await Appointment.findById(appointmentId).populate("customer")

            if(!appointment)
            {
                return next(errorHandler(404,"appointment not found"))
            }

            // Get amount
            const amountObj = body.Item.find(obj => obj.Name === 'Amount');

            const amount = amountObj.Value

            // Get Mpesa code
            const codeObj = body.Item.find(obj => obj.Name === 'MpesaReceiptNumber');

            const trnx_id = codeObj.Value


            // Get phone number 
            const phoneNumberObj = body.Item.find(obj => obj.Name === 'PhoneNumber');

            const phone = phoneNumberObj.Value

            // Get transaction date
            const DateObj = body.Item.find(obj => obj.Name === 'TranscationDate');
            
            const date = DateObj.Value


            const pay = new Payment({
                amount,date,trnx_id,phone,
                name:appointment.customer.username
            })

            await pay.save()

            // send notification that the stk PUSH has been attended to 
            sendEventToClients({success:true ,message:'STK push has been attended to'})

            res.status(200).json({success:true, pay})

        }

    }
    catch(error)
    {
        next(error)
    }

}


export const confirmPayment = async (req,res,next) => {

    const {appointmentId,CheckoutRequestID} = req.params
    
    const token = req.token

    try
    {
        const auth = "Bearer " + token

        const url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query"

        const date = new Date()

        const timestamp = 
            date.getFullYear() + 
            ("0" + (date.getMonth() + 1)).slice(-2) +
            ("0" + date.getDate()).slice(-2) +
            ("0" + date.getHours()).slice(-2) +
            ("0" + date.getMinutes()).slice(-2) +
            ("0" + date.getSeconds()).slice(-2)
        
        const shortcode = process.env.PAYBILL 

        const passKey = process.env.PASS_KEY

        const password = new Buffer.from(shortcode + passKey + timestamp).toString("base64")

        const requestBody = {    
                "BusinessShortCode":shortcode,    
                "Password": password,    
                "Timestamp":timestamp,    
                "CheckoutRequestID": CheckoutRequestID,    
        } 

        const response = await axios.post(url,requestBody,
            {
                headers:{
                    "Authorization":auth
                }
            }
        )

        if(response.data.ResultCode === "0")
        {
            const appointment = await Appointment.findById(appointmentId)

            if(appointment)
            {
                appointment.paid = true

                await appointment.save()
            }
            else
            {
                return next(errorHandler(404,"Appointment not found"))
            }
            
            res.status(200).json({success:true ,data:response.data ,message:'Transaction was successful'})
        }
        else
        {
            res.status(200).json({success:true , data:response.data , message:`${response.data.ResultDesc}`})
        }
        

    }
    catch(error)
    {
        next(error)
    }

}