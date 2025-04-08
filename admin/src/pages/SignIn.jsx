


import React, { useContext, useState } from 'react'
import { StoreContext } from '../context/store'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/useSlice'
import axios from "axios"
import Logoo from "../assets/logo.png"
import { IoMdEyeOff } from 'react-icons/io'
import { IoEye } from 'react-icons/io5'



export default function SignIn() {

  const {url,setToken} = useContext(StoreContext)

  const {loading,error} = useSelector(state => state.user)

  const [formData, setFormData] = useState({})

  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()

  const navigate = useNavigate()


  // handleChange
  const handleChange = (e) => {

    const {name,value} = e.target 

    setFormData({...formData,[name]:value})

  }


  // handleSubmit
  const handleSubmit = async (e) => {

    e.preventDefault()

    dispatch(signInStart())

    try
    {

      const res = await axios.post(url + "/api/auth/login", formData)

      if(res.data.success)
      {
        setToken(res.data.token)

        localStorage.setItem("token", res.data.token)

        dispatch(signInSuccess(res.data.rest))

        navigate('/')

      }

    }
    catch(error)
    {

      if(error.response)
      {

        const errorMessage = error.response.data.message

        dispatch(signInFailure(errorMessage))

      }
      else
      {
        dispatch(signInFailure(error.message))
      }

    }

  }

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

            <h2 className="text-center text-2xl/9 font-bold tracking-tighter text-gray-900">
              Sign in to your account
            </h2>

          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="">

            {/* email */}
            <div className="flex flex-col gap-y-2">

              <label className="">email</label>

              <input 
                type="text"
                name="email" 
                placeholder='name@example.com'
                onChange={handleChange}
                value={formData?.email}
                className="" 
              />

            </div>

            {/* password */}
            <div className="flex flex-col gap-y-1">

              <label  className="">password</label>

              <div className="w-full relative">

                <input 
                  type={showPassword ? "password" : "text"} 
                  name="password"
                  placeholder='*************'
                  onChange={handleChange}
                  value={formData?.password}
                  className="w-full" 
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
            

          </form>

        </div>

    </main>
    
  )

}
