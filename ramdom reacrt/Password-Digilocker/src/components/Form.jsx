import React, { useState } from 'react'
import { X } from 'lucide-react'
import '../App.css'

const Form = ({newWebName,setNewWebName,newWebUserName,setNewWebUserName,newWebPassword,setNewWebPassword,addNewWebDetails,closeForm}) => {
  const [msg,setMsg] = useState('')

  function addNew(){

    if(!newWebName | !newWebPassword)
    {
      setMsg('Please fill all the details')
      setTimeout(() => {
        setMsg('')
      },2000)
      return;
    }
    
    addNewWebDetails();
    closeForm()
  }
  
  function hideForm(){
    setNewWebName('')
    setNewWebPassword('')
    setNewWebUserName('')
    closeForm()
  }

  return (
    <div className="mt-25 lg:mt-35 md:mt-20">
        <div className="flex bg-gray-700 flex-col w-75 mt-0 justify-self-center gap-5 p-10">
            <div className="flex text-white justify-between w-75 text-center mb-5 items-center ml-5">
                <h2 className='flex text-xl ml-13'> Details</h2>
                <X onClick={() => hideForm()} className='flex-1/12 w-5 h-5 ml-[-15px] text-white hover:text-red-400 cursor-pointer'/>
            </div>

            {msg && <h2 className='mt-[-10px] text-center text-red-400 font-semibold '>{msg}</h2>}
            
            <input type="text" className='border-2 border-gray-500 text-white p-2 rounded-md bg-black/30' placeholder='Enter Website Name..' value={newWebName} onChange={(e) => setNewWebName(e.target.value)}/>
            <input type="text" className='border-2 border-gray-500 text-white p-2 rounded-md bg-black/30' placeholder='Enter Username' value={newWebUserName} onChange={(e) => setNewWebUserName(e.target.value)}/>
            <input type="text" className='border-2 border-gray-500 text-white p-2 rounded-md bg-black/30' placeholder='Enter Password' value={newWebPassword} onChange={(e) => setNewWebPassword(e.target.value)}/>
            
            <div className="flex justify-between px-5 mt-5">
                <button className='text-red-500 bg-[#0f172a] px-4 py-2 rounded-md cursor-pointer hover:bg-neutral-600  font-semibold' onClick={() => hideForm()}>Cancel</button>
                <button className='text-emerald-500 bg-[#0f172a] px-4 py-2 rounded-md cursor-pointer hover:bg-neutral-600  font-semibold' onClick={() => addNew()}>Add</button>
            </div>
            
        </div>
    </div>
  )
}

export default Form