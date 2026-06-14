import React from 'react'
import {Route,Routes} from 'react-router-dom'
import { Login } from './components/Login'
import Home from './components/Home'


function App (){
  return (
    <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/Home' element={<Home/>}></Route>
    </Routes>
  )
}
export default App