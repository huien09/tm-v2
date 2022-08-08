import React, { useState } from "react"
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'

function UpdateEmail() {
  const [username, setUsername] = useState(localStorage.getItem("sysUsername")) 
  const [email, setEmail] = useState("")
  const [notif, setNotif] = useState("")
  const navigate = useNavigate()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    try {
        Axios.post('http://localhost:4000/updateemail', {username, email
    }).then((response) => {
        //console.log(response.data);
        setNotif(response.data)
        setEmail(e.target.reset())
    })
    } catch(e) {
        console.log("Error encountered");
    }
}

  return (
    <div>
    <button onClick={() => navigate(-1)} type="submit">Back</button>
    <h2>Update Email</h2>
    <form onSubmit={handleSubmit}>
    <label htmlFor="username" className="text-muted mb-1">Logged in as: {username}</label>
    <br/>
    <label htmlFor="email" className="text-muted mb-1"> Enter new email: </label>
    <input onChange={e => setEmail(e.target.value)} type="email" name="email" placeholder="Email" /><br/>
    <button type="submit">Submit</button>
    {/* <button type="reset">Clear</button> */}
    <p><strong>{notif}</strong></p>
    </form>
    </div>
  )
}

export default UpdateEmail