

import React from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import {useSelector} from "react-redux"
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import DashSidebar from './components/DashSidebar'
import Profile from './pages/Profile'



const LayOut = () => {

  const {currentUser} = useSelector(state => state.user)

  return(

    currentUser?.isAdmin ?

    <div className="w-full h-screen flex-col">

      <Header />

      <div className="w-full flex lg:divide-x-2 divide-black min-h-[90vh]">

        {/* sidebar */}
        <div className="p-5 hidden lg:flex lg:w-[20%] overflow-y-auto">

          <DashSidebar />

        </div>

        {/* mainside */}
        <div className="w-full lg:w-[80%] overflow-y-auto overflow-hidden">

          <Outlet/>

        </div>

      </div>

    </div>

    :

    <Navigate to="/sign-in"/>

  )
  
}


export default function App() {

  return (

   <BrowserRouter>

      <main className="w-full  min-h-screen">

        <Toaster richColors/>

        <Routes>

          <Route element={<LayOut/>}>

            <Route path="/" element={<Dashboard/>} />

            <Route path="/profile" element={<Profile/>} />

          </Route>

          <Route path="/sign-in" element={<SignIn/>} />

          <Route path="/sign-up" element={<SignUp/>} />

          <Route path="/forgot-password" element={<ForgotPassword/>} />

          <Route path="/reset-password/:token" element={<ResetPassword/>} />

        </Routes>

      </main>
   
   </BrowserRouter>

  )

}
