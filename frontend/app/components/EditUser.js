import React, { useState } from "react"
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'

function EditUser() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [notif, setNotif] = useState("")
    const [notif2, setNotif2] = useState("")
    const [notif3, setNotif3] = useState("")
    const navigate = useNavigate()

    async function handlePassword(e) {
	    e.preventDefault()
      try {
        const response = await Axios.post('http://localhost:4000/resetuserpassword', {username, password})
        //console.log(response.data)
        setNotif(response.data)
        setUsername(e.target.reset())
        setPassword(e.target.reset())
      } catch(e) {
        console.log("Error encountered")
      }
    }

    async function handleEmail(e) {
      e.preventDefault();
      try {
        const response = await Axios.post('http://localhost:4000/updateuseremail', {username, email})
        //console.log(response.data);
        setNotif2(response.data);
        setUsername(e.target.reset())
        setEmail(e.target.reset())
      } catch(e) {
        console.log("Error encountered");
      }
    }

    async function handleDisable(e) {
        e.preventDefault()
        try {
          const response = await Axios.post('http://localhost:4000/disableuser', {username})
          //console.log(response.data)
          setNotif3(response.data)
          setUsername("")
        } catch(e) {
          console.log("Error encountered")
        }
      }
  
      async function handleEnable(e) {
        e.preventDefault()
          try {
            const response = await Axios.post('http://localhost:4000/enableuser', {username})
            //console.log(response.data)
            setNotif3(response.data)
            setUsername("")
          } catch(e) {
            console.log("Error encountered")
          }
        }

    return (
        <div>
          <button onClick={() => navigate(-1)} type="submit">Back</button>
          <h3>Reset User Password</h3>
          <form onSubmit={handlePassword}>
          <label htmlFor="username" className="text-muted mb-1"> </label>
          <input onChange={e => setUsername(e.target.value)} type="text" name="username" placeholder="Enter username" /><br/>
          <label htmlFor="password" className="text-muted mb-1"> </label>
          <input onChange={e => setPassword(e.target.value)} type="password" name="password" placeholder="Enter New Password" /><br/>
          <button type="submit">Reset Password</button>
          {/* <button type="reset">Clear fields</button> */}
          <p><strong>{notif}</strong></p><br/>
          {/* <label htmlFor="pwdnote" className="text-muted mb-1">Leave password field blank to reset to common default password</label> */}
          </form>
          <h3>Update User Email</h3>
          <form onSubmit={handleEmail}>
          <label htmlFor="username" className="text-muted mb-1"> </label>
          <input onChange={e => setUsername(e.target.value)} type="text" name="username" placeholder="Enter Username" /><br/>
          <label htmlFor="email" className="text-muted mb-1"> </label>
          <input onChange={e => setEmail(e.target.value)} type="email" name="email" placeholder="Enter New Email" /><br/>
          <button type="submit">Update Email</button>
          {/* <button type="reset">Clear fields</button> */}
          <p><strong>{notif2}</strong></p><br/>
          </form>
          <h3>Disable/Enable User</h3>
          <form>
          <label htmlFor="username" className="text-muted mb-1"> </label>
          <input onChange={e => setUsername(e.target.value)} type="text" name="username" placeholder="Enter Username" /><br/>
          <button onClick={handleDisable} type="submit">Disable</button>
          <button onClick={handleEnable} type="submit">Enable</button>
          <button type="reset">Clear</button>
          <p><strong>{notif3}</strong></p>
          </form>
        </div>
    )
}

export default EditUser