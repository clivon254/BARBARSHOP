

import React from 'react'

export default function Alert({color,text}) {

  return (

    <div className={`${color === "failure" ? "bg-red-200 text-red-600" :""} ${color === "success" ? "bg-green-200 text-green-600" :""} py-2 rounded-md`}>

        <p className="text-center text-sm">{text}</p>

    </div>
    
  )

}
