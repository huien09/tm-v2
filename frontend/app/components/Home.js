//import axios from "axios"
import React, { useEffect, useState } from "react"
//import ReactDOM from "react-dom/client"
import { Link, useNavigate } from 'react-router-dom'

function Home(props) {
  const [namelabel, setNameLabel] = useState(localStorage.getItem("sysUsername"))
  var navigate = useNavigate()

  function handleLogout() {
    //props.setLoggedIn(false)
    //localStorage.removeItem("sysUsername")
    //localStorage.removeItem("userToken")
    localStorage.clear()
    navigate("/")
  }

  return (
    // <>
      <div className="container container--narrow py-md-5">
        <title>Home</title>
        <label>Welcome, <strong>{namelabel}</strong> </label>
        <button onClick={handleLogout}>Log out</button>
        <label> Settings: </label>
        <Link to="/ChangePassword">Change Password</Link>{" | "}
        <Link to="/UpdateEmail">Update Email</Link>
        <h4>User Management</h4>
        <Link to="/CreateUser">Create User</Link>{" | "}
        <Link to="/EditUser">Edit User</Link>
        <h4>User Group Management</h4>
        <Link to="/UserGroup">Create/Edit User Group</Link>
      </div>
    //</>
  )
}

export default Home
