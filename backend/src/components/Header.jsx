

import React, { Fragment, useContext } from 'react'
import { StoreContext } from '../context/store'
import { MdClose, MdMenu } from "react-icons/md"
import Logoo from "../assets/logo.png"
import { useSelector } from 'react-redux'
import {Link} from "react-router-dom"
import DashSidebar from './DashSidebar'


export default function Header() {

  const {url,isOpen,setIsOpen} = useContext(StoreContext)

  const {currentUser} = useSelector(state => state.user)

  return (

    <>

      {/* header */}
      <header className="w-full p-2 border-b border-black">

        <div className="flex items-center justify-between ">
          
          {/* toggleButton */}
          <div className="lg:hidden cursor-pointer">
            {isOpen ? 
              (
                <button className="">
                  <MdClose  
                    size={30}
                    onClick={() => setIsOpen(false)}
                  />
                </button>
              ) 
              : 
              (
                <button className="">
                  <MdMenu
                    size={30}
                    onClick={() => setIsOpen(true)}
                  />
                </button>
              )
            }
          </div>

          {/* logo */}
          <div className="h-10 w-12">

            <img 
              src={Logoo}
              alt="" 
              className="w-full h-full" 
            />

          </div>

          {/* dropdown */}
          <div className="">

            <Link to="/profile">

              <img 
                  src={currentUser?.profilePicture} 
                  alt="" 
                  className="h-10 w-10 rounded-full" 
              />

            </Link>
            
          </div>


        </div>

      </header>

      {/* drawer */}
      <div className={`w-full h-full fixed top-0 bg-black/50 backdrop-blur-sm origin-right transition-all duration-200 ease-in overflow-hidden z-50 ${isOpen ? "left-0" : "left-[-100%]" }`}>
        
        {/* togglebutton */}
        <div className="absolute left-0 w-[70%] h-full bg-white space-y-6 overflow-y-scroll px-3">

            <div className="flex justify-end p-2">

              <span className="cursor-pointer" onClick={() => setIsOpen(false)}>

                <MdClose size={30} className="font-bold"/>

              </span>

            </div>

        </div>

        <DashSidebar />

      </div>

    </>
    
  )

}
