

import express from "express"
import { deleteUser, getUser, getUsers, updateUser } from "../controller/userController.js"
import { verifyToken } from "../Utils/verify.js"


const userRouter = express.Router()


userRouter.get('/get-user/:userId', getUser)


userRouter.get('/get-users', verifyToken , getUsers)


userRouter.put('/update-user/:userId', verifyToken ,updateUser)


userRouter.delete('/delete-user/:userId', verifyToken, deleteUser)



export default userRouter