import React from 'react'
import spacebg from "../assets/space.mp4"
import "../stylesheets/Chat.css"
import { useState } from 'react'
import CommanToAll from '../context/CommanToAllContext'
import { useContext } from 'react'
import Navbar from './Navbar'
function Chat() {
  const context  = useContext(CommanToAll)
  const {convertUTCToIST} = context
  const [msg, setmsg] = useState("")
  const handleOnchageInput = (event) => {
    event.preventDefault()
    setmsg(event.target.value)
  }
  const handlesendmsg = async ()=> {
    let response = await fetch("http://localhost:5000/api/message/addmsg",{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({sender : "user" , receiver : "chatai" , message : msg})
    })
    let json  = await response.json()
    const container  = document.querySelector(".msgcontainer")
    console.log(container)
    const newdiv1 = document.createElement("div") // text_container
    const newdiv2 = document.createElement("div")
    const newdiv3 = document.createElement("div")
    const newdiv4 = document.createElement("div")
    const newdiv5 = document.createElement("span")
    const newdiv11 = document.createElement("div")
    const newdiv12 = document.createElement("span")
    newdiv11.className = "sender_name user_name"
    newdiv12.innerHTML = "user"
    newdiv11.appendChild(newdiv12)
    newdiv1.className = "text_container user_text_container"
    newdiv2.className = "user_text_message text_message"
    newdiv3.className = "text_question user_text_question"
    newdiv4.className = "text_msg_time"
    newdiv3.innerHTML = msg
    newdiv5.innerHTML = convertUTCToIST(Date.now())
    newdiv4.appendChild(newdiv5)
    newdiv2.appendChild(newdiv11)
    newdiv2.appendChild(newdiv3)
    newdiv2.appendChild(newdiv4)
    newdiv1.appendChild(newdiv2)
    container.appendChild(newdiv1)
    let response1 = await fetch("http://localhost:5000/api/chat/spacebot",{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({prompt_ : msg})
    })
    let json1 = await response1.json()
    const newdiv6 = document.createElement("div") // text_container
    const newdiv7 = document.createElement("div")
    const newdiv8 = document.createElement("div")
    const newdiv9 = document.createElement("div")
    const newdiv10 = document.createElement("span")
    const newdiv13 = document.createElement("div")
    const newdiv14 = document.createElement("span")
    newdiv13.classList =  "sender_name bot_name"
    newdiv14.innerHTML = "CosmicVista"
    newdiv6.className = "text_container bot_text_container"
    newdiv7.className = "bot_text_message text_message"
    newdiv8.className = "text_question bot_text_question"
    newdiv9.className = "text_msg_time"
    newdiv10.innerHTML = convertUTCToIST(Date.now())
    newdiv8.innerHTML = json1.responseFromAi
    newdiv9.appendChild(newdiv10)
    newdiv13.appendChild(newdiv14)
    newdiv7.appendChild(newdiv13)
    newdiv7.appendChild(newdiv8)
    newdiv7.appendChild(newdiv9)
    newdiv6.appendChild(newdiv7)
    container.appendChild(newdiv6)
  }
  return (
  <>
  <video id='background-video' className='bg_video' autoPlay muted loop>
        <source src={spacebg} type="video/mp4" className = "bg_inside_video"/>
      </video>
  <div className='chat'>
      <div className="msgcontainer container previous_chat">
      </div>
    <div className="container-fluid chat_parent">
      <div className="chat_input_container input-group container mb-3">
        <input
          name = "msg"
          id = "msgToSend"
          type="text"
          className="form-control chat_input"
          placeholder="Present your doubt here....."
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
          onChange={handleOnchageInput}
        />
        <button className="input-group-text btn_ask" id="basic-addon2" onClick={handlesendmsg} >
          Ask
          <i className="fa-solid fa-paper-plane send_icon"></i>
        </button>
      </div>
    </div>
    </div>
  </>
  )
}

export default Chat