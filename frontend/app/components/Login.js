import React, { useState } from 'react'
import Logout from './Logout'
import Home from './Home'
import HomeUser from './HomeUser'
//import { useNavigate } from 'react-router-dom'

function Login() {
  const [loggedIn, setLoggedIn] = useState("")
  const [access, setAccess] = useState("")
  //console.log(localStorage.getItem("userToken"))
  let a = localStorage.getItem("userToken")
  
  //setAccess(localStorage.getItem("userToken"))
  const redirect = () => {
    //if(loggedIn) {
      if(a == "1"){
        return <Home />
      } else if (a == "0"){
        return <HomeUser />
      } 
    else {
      return <Logout />
    }
  }

  return (
    <div>
        {/* <label>Login page</label> */}
        {/* {loggedIn ? <Home setLoggedIn={setLoggedIn} /> : <Logout setLoggedIn={setLoggedIn} />} */}
        {redirect()}
    </div>
  )
}

export default Login