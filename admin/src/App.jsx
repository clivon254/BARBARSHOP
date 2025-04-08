

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



const LayOut = () => {

  const {currentUser} = useSelector(state => state.user)

  return(

    currentUser?.isAdmin ?

    <div className="">

      <Header />

      <div className="">

        <Outlet/>

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
