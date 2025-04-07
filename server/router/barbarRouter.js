
import express from "express"
import { verifyToken } from "../Utils/verify.js"
import { addBarbar, deleteBarbar, getBarbar, getBarbars, updateBarbar } from "../controller/barbarController.js"


const barbarRouter = express.Router()


barbarRouter.post('/add-barbar', verifyToken ,addBarbar)


barbarRouter.get('/get-barbar/:barbarId', getBarbar)


barbarRouter.get('/get-barbars', getBarbars)


barbarRouter.put('/update-barbar/:barbarId', verifyToken, updateBarbar)


barbarRouter.delete('/delete-barbar/:barbarId', verifyToken, deleteBarbar)



export default barbarRouter
