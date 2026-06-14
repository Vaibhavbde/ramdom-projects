import { useEffect, useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
    const [userName,setUserName] = useState("")
    const [password,setPassword] = useState("")
    const [msg,setShowMsg] = useState("")
    const [prevUserData, setprevUserData] = useState(
    JSON.parse(localStorage.getItem('userdata')) || []
    );   

    const navigate = useNavigate()

    function checkUser(){
        if(userName === "" || password === "")
            {
                alert('Please Enter Valid Details')
            return        
        }


        const existingUser = prevUserData.find((user) => user.username === userName);

        if(!existingUser)
        {
            setShowMsg("Please Create An Account.")
        }
        else{

            if(existingUser.password === password)
            {
                console.log("Authenticated")
                localStorage.setItem('loggedInUser', userName); 
                navigate(`/home`,{state:{password,userName}})
            }
            else
                setShowMsg("Incorrect password.")
        }

        setTimeout(() => { setShowMsg("") },2000)
    }
            
        

    function createNewUser(){
        const userExists = prevUserData.find(user => user.username === userName)

        if(userExists)
        {
            setShowMsg("User already exists..Please Login using password")
            setTimeout(() => { setShowMsg("") },2000)
            return
        }
        const newUserData = {username:userName,password:password,websites:[]}
        const updatedUsers = [...prevUserData, newUserData];

        setprevUserData(updatedUsers)
        // console.log(newUserData)
        
        setUserName('')
        setPassword('')
    }
    useEffect(()=>{
                localStorage.setItem('userdata',JSON.stringify(prevUserData))

            console.log('New USer updated:',JSON.parse(localStorage.getItem('userdata')))
    },[prevUserData])



    return (
    <div className=' bg-gray-100 m-auto w-80 lg:w-100 p-10 mt-50 rounded-md'>
        
        <h2 className='text-center text-3xl font'>Login/SignUp</h2>

        <h2 className={`transition-all duration-1000 ease-in-out text-red-600 mt-4 text-xl font-semibold text-center
        ${msg?'opacity-200':'opacity-0'}`}>{msg}</h2>  
  
        <div className='flex flex-col gap-3 mt-6 w-[80%] justify-self-center'>
        <input className=' border-blue-500 border-3 outline-none p-1 text-1xl rounded-md' type="text" name='userName' placeholder='Enter Username' value={userName} onChange={(e) => setUserName(e.target.value)}/>
        <input className=' border-blue-500 border-3 outline-none p-1 text-1xl rounded-md' type='password' name='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>

        <div className='flex justify-between mt-6 w-[80%] justify-self-center'>
            <button className=' cursor-pointer bg-[#28a745] px-4 py-1 rounded-md text-white hover:bg-[#1e7e34]' onClick={createNewUser}>SignUp</button>
            <button className=' cursor-pointer bg-[#007bff] px-4 py-1 rounded-md text-white hover:bg-[#0056b3]' onClick={checkUser}>Login</button>
        </div>

    </div>
  )
}
