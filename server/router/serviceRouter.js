

import express from "express"
import { verifyToken } from "../Utils/verify.js"
import { addService, deleteService, getService, getServices, updateService } from "../controller/serviceController.js"


const serviceRouter = express.Router()


serviceRouter.post('/add-service', verifyToken , addService)


serviceRouter.get('/get-service/:serviceId', getService)


serviceRouter.get('/get-services', getServices)


serviceRouter.put('/update-service/:serviceId', updateService)


serviceRouter.delete('/delete-service/:serviceId', deleteService)


export default serviceRouter