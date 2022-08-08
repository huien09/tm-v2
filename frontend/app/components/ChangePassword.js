import React, { useState } from 'react'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'

function ChangePassword() {
	const [username, setUsername] = useState(localStorage.getItem("sysUsername")) //to retrieve after sign in
  const [password, setPassword] = useState("")
  const [notif, setNotif] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
		e.preventDefault()
		try {
			Axios.post('http://localhost:4000/changepassword', {username, password
    }).then((response) => {
      //console.log(response.data);
      setNotif(response.data)
      setPassword(e.target.reset())
    })
		} catch(e) {
			console.log("Error encountered")
		}
	}

  return (
    <div>
      <button onClick={() => navigate(-1)} type="submit">Back</button>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
      <label htmlFor="username" className="text-muted mb-1">Logged in as: {username}</label><br/>
      <label htmlFor="password" className="text-muted mb-1">Enter New Password: </label>
      <input onChange={e => setPassword(e.target.value)} type="password" name="password" placeholder="Password" /><br/>
      <button type="submit">Submit</button>
      {/* <button type="reset">Clear</button> */}
      <p><strong>{notif}</strong></p>
      <p>Requirements:<br/>-Minimum of 8 characters, maximum of 10 characters<br/>-Should consist of alphabets, numbers and special characters</p>
      </form>
    </div>
  )
}

export default ChangePassword