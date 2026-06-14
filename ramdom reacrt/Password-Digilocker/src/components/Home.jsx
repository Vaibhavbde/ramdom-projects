import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Navbar from './Navbar'
import Form from './Form'
import DataCard from './DataCard'

const Home = () => {
    
    const location = useLocation()
    const navigate = useNavigate()

    //This will get the logged username & password from Login page.
    // const userPassword = location.state?.password
    const userName = location.state?.userName || localStorage.getItem('loggedInUser')

    //This will retrive all users data
    const savedUsers = JSON.parse(localStorage.getItem("userdata")) || [];

    //This variable will store Data of the logged user
    const currentLoggedUser = savedUsers.find(user => user.username === userName);
    const loggedUserIndex = savedUsers.findIndex(user => user.username === userName); 

    //This will store All websites details of logged user if not found then it'll return an empty array
    const [currentUserData, setCurrentUserData] = useState(() => {
        return currentLoggedUser ? currentLoggedUser.websites : [];
    });

    const [newWebName,setNewWebName] = useState('')
    const [newWebUserName,setNewWebUserName] = useState('')
    const [newWebPassword,setNewWebPassword] = useState('')
    const [showform,setShowForm] = useState(false)



    function addNewWebDetails(){
        const newWebData = {webName:newWebName,webUserName:newWebUserName,webPassword:newWebPassword}
        const updatedWebData = [...currentUserData,newWebData]
        setCurrentUserData(updatedWebData)

        //This will initialize updatedWebData to savedUsers
        savedUsers[loggedUserIndex].websites = updatedWebData
        console.log('new:',savedUsers)

        localStorage.setItem("userdata", JSON.stringify(savedUsers));
        
        //Removing all input Values
        setNewWebName('')
        setNewWebUserName('')
        setNewWebPassword('')

    }
    function deleteObj(object){
        if(confirm("Are You Sure Want to Delete?")){
        const newUserData = currentUserData.filter(dat => dat!=object) //This will remove web details of deleted one
        setCurrentUserData(newUserData)
        savedUsers[loggedUserIndex].websites = newUserData
        localStorage.setItem("userdata", JSON.stringify(savedUsers));}
        else
            return
    }
    function logout(){
        if(confirm("Are you sure want to Logout?"))
        {
            localStorage.removeItem('loggedInUser');
            navigate('/')
        }
    }

    const copyPassword = (password) => {
    navigator.clipboard.writeText(password);
    alert("Password copied to clipboard!");
  };

  function hiddenpassword(len){
    const maxLen = 10;

    const paswordLen = len >= maxLen?maxLen:len
    return '•'.repeat(paswordLen-2)
  }

  return (
    <div className='bg-[#0f172a] text-slate-800 min-h-screen'>
        <Navbar userName={userName} logout={() => logout()} setShowForm={() => setShowForm(true)}/>

        <h1 className=" text-3xl w-full font-bold lg:hidden md:hidden text-center mt-5"> 👋 <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400'>Welcome, {userName}! </span></h1>

        {!showform && currentUserData.length === 0 && <h2 className='flex w-full text-neutral-300 text-center justify-center mt-50 lg;mt-10 md:mt-10 text-2xl'>🗝️ No passwords stored yet.</h2>}
        {!showform && currentUserData.length !== 0 &&
        <div className='flex flex-col gap-20 py-10 px-15 lg:px-40'>
            <div className='flex flex-col lg:flex-row md:flex-row gap-5 lg:grid grid-cols-3 flex-wrap justify-center items-center text-[#94a3b8]'>  
                { currentUserData && currentUserData.map(dat => <DataCard data={dat} deleteObj={deleteObj} hiddenpassword={hiddenpassword} copyPassword={copyPassword}/>)}
            </div>
        </div>}
        <Plus size={50} onClick={() => setShowForm(true)} className='bg-blue-800 hover:bg-blue-700 text-white hover:scale-102 transition-all rounded-xl p-1 m-auto cursor-pointer fixed bottom-8 right-4 flex text-5xl lg:hidden'/>
        {showform && <Form newWebName={newWebName} closeForm={() => setShowForm(false)} setNewWebName={setNewWebName} newWebUserName={newWebUserName} setNewWebUserName={setNewWebUserName} newWebPassword={newWebPassword} setNewWebPassword={setNewWebPassword} addNewWebDetails={addNewWebDetails}/>}
    </div>
  )
}

export default Home