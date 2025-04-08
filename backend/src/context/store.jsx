

import React, { createContext, useEffect, useState } from 'react'


export const StoreContext = createContext()



export default function StoreContextProvider(props) {

  const url = "http://localhost:3500"

  const [token , setToken] = useState(localStorage.getItem("token"))

  const [isOpen ,setIsOpen] = useState(false)


  useEffect(() => {

    if(localStorage.getItem("token"))
    {
        setToken(localStorage.getItem("token"))
    }

  },[token])
  

  const contextValue = {
    url,
    token,setToken,
    isOpen,setIsOpen
  }


  return (

    <StoreContext.Provider value={contextValue}>

        {props.children}

    </StoreContext.Provider>

  )

}
