import { Lock, LogOut, UserCircle } from 'lucide-react'
import React from 'react'
import '../App.css'

const Navbar = ({userName,logout,setShowForm}) => {
  return (
    <div className="flex justify-between gap-10 bg-[#1e293b] text-[#f1f5f9] px-5 lg:px-20 md:px-10 py-5 m-auto items-center">
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/20">
          <Lock className=" text-blue-500" />
        </div>
        <h1 className="text-2xl lg:text-4xl md:text-4xl mb-2 font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
          SecureVault
        </h1>
      </div>
        <h1 className="text-3xl font-bold hidden lg:flex md:flex"> 👋 <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400'>Welcome, {userName}! </span></h1>
        <div className="flex gap-5 lg:gap-10">
          <button onClick={setShowForm} className='bg-blue-800 hover:bg-blue-700 text-white p-2 hover:scale-102 transition-all rounded-md m-auto cursor-pointer hidden lg:flex md:flex'>Add New</button>  
          <LogOut onClick={logout} size={35} className='bg-[#3f4651] border-neutral-400 border-2 hover:bg-red-500/100 text-[#ffffff] cursor-pointer p-2'/>
        </div>
    </div>
  )
}

export default Navbar