


import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../context/store'
import axios from "axios"
import Logoo from "../assets/logo.png"
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import {toast} from "sonner"


export default function ForgotPassword() {

  const {url} = useContext(StoreContext)

  const [email,setEmail] = useState("")

  const [loading ,setLoading] = useState(false)

  const [error ,setError] = useState(null)

  const [alert , setAlert] = useState(false)



  // handleSubmit
  const handleSubmit = async (e) => {
    
    e.preventDefault()

    setLoading(true)

    setError(null)

    setAlert(false)

    if(!email || email === "")
    {
      setError("Please provide an email")

      setLoading(false)

      return
    }

    console.log("okey")

    try
    {

      const res = await axios.post(url + "/api/auth/forgot-password", {email:email})

      if(res.data.success)
      {
        
        toast.success("email sent to you account")

        setLoading(false)

        setEmail("")

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




  console.log(email)

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
            <div className="space-y-3">

              <h2 className="text-center text-2xl/9 font-bold tracking-tighter text-gray-900">
                Forgot Password
              </h2>

              <p className="text-center font-semibold">Enter your signed up email and a link will be sent to you account to reset password</p>

            </div>

          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-3 max-w-lg mx-auto">

            {/* email */}
            <div className="flex flex-col gap-y-1">

              <label className="label">email</label>

              <input 
                type="text"
                placeholder='name@example.com'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="input" 
              />

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

             <Alert color="success" text={"The link is sent"}/>

            )}
            
          </form>

        </div>

    </main>
    
  )

}
