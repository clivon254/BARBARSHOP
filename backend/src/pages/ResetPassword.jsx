

import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../context/store'
import axios from "axios"
import Logoo from "../assets/logo.png"
import { IoMdEyeOff } from 'react-icons/io'
import { IoEye } from 'react-icons/io5'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import {toast} from "sonner"
import { useParams } from 'react-router-dom'


export default function ResetPassword() {

  const {url} = useContext(StoreContext)

  const [password,setPassword] = useState("")

  const [confirmPassword, setConfirmPassword] = useState("")

  const [loading ,setLoading] = useState(false)

  const [error ,setError] = useState(null)

  const [alert , setAlert] = useState(false)

  const [showPassword ,setShowPassword] = useState(false)

  const [showPasswordConfirm ,setShowPasswordConfirm] = useState(false)

  const {token} = useParams()

 
  // handleSubmit
  const handleSubmit = async (e) => {
    
    e.preventDefault()

    setLoading(true)

    setError(null)

    setAlert(false)

    if(!password || password === "")
    {
      setError("Please provide a password")

      setLoading(false)

      return
    }

    if(!confirmPassword || confirmPassword === "")
      {
        setError("Please provide a confirmPassword")
  
        setLoading(false)
  
        return
      }

    console.log("okey")

    try
    {

      const res = await axios.post(url + `/api/auth/reset-password/${token}`, {password:password ,confirmPassword:confirmPassword})

      if(res.data.success)
      {
        
        toast.success("password is reset successfully")

        setLoading(false)

        setPassword("")

        setConfirmPassword("")

        setAlert(true)

      }

    }
    catch(error)
    {

      setLoading(false)

      setAlert(false)

      if(error.response)
      {

        const errorMessage = error.response.data.message

        setError(errorMessage)

      }
      else
      {
        setError(error.message)
      }

    }

  }

  console.log(password)

  console.log(confirmPassword)


  return (
    
    <main className="min-h-screen w-full flex items-center justify-center px-8">

        <div className="w-full flex flex-col gap-y-5">

          {/* header  */}
          <div className="flex items-center flex-col gap-y-2">

            {/* logo */}
            <div className="h-20 w-24">

              <img 
                src={Logoo}
                alt="" 
                className="h-full w-full" 
              />

            </div>
            
            {/* title */}
            <h2 className="text-center text-2xl/9 font-bold tracking-tighter text-gray-900">
              Reset Password
            </h2>

          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-3 max-w-lg mx-auto">

            {/* password */}
            <div className="flex flex-col gap-y-1">

              <label  className="label">password</label>

              <div className="w-full relative">

                <input 
                  type={showPassword ? "password" : "text"} 
                  name="password"
                  placeholder='*************'
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="input w-full" 
                />

                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <IoMdEyeOff /> : <IoEye />}
                </button>

              </div>

            </div>

            {/* confirm password */}
            <div className="flex flex-col gap-y-1">

              <label  className="label">confirm password</label>

              <div className="w-full relative">

                <input 
                  type={showPasswordConfirm ? "password" : "text"} 
                  name="password"
                  placeholder='*************'
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  className="input w-full" 
                />

                <button 
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPasswordConfirm ? <IoMdEyeOff /> : <IoEye />}
                </button>

              </div>

            </div>

            <button 
              type="submit"
              className="button"
              disabled={loading}
            >
              {loading ? <Loading/> : "submit"}
            </button>

            {error && (

              <Alert color="failure" text={error}/>

            )}

            {alert && (

             <Alert color="success" text={"Password reset successfully"}/>

            )}
            
          </form>

        </div>

    </main>
    
  )

}
