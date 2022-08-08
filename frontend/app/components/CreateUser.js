import React, { useState } from 'react'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'

function CreateUser() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [notif, setNotif] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e) {
		e.preventDefault()
		try {
			const response = await Axios.post('http://localhost:4000/createuser', {username, password, email})
      //console.log(response.data)
      setNotif(response.data)
      //setUsername(e.target.reset())
      //setPassword(e.target.reset())
      //setEmail(e.target.reset())
		} catch(e) {
			console.log("Error encountered")
		}
	}

  return (
    <div>
      <button onClick={() => navigate(-1)} type="submit">Back</button>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username" className="text-muted mb-1">Username: </label>
        <input onChange={e => setUsername(e.target.value)} type="text" name="username" placeholder="Username" /><br/>
        <label htmlFor="password" className="text-muted mb-1">Password: </label>
        <input onChange={e => setPassword(e.target.value)} type="password" name="password" placeholder="Password" /><br/>
        <label htmlFor="email" className="text-muted mb-1">Email: </label>
        <input onChange={e => setEmail(e.target.value)} type="email" name="email" placeholder="Email" /><br/>
        {/* <select onChange={e => setGroupselect(e.target.value)} id="cars" name="cars" size="4" multiple>
          <option value="volvo">Volvo</option>
          <option value="toyota">Toyota</option>
          <option value="fiat">Fiat</option>
          <option value="audi">Audi</option>
        </select><br/> */}
        <button type="submit">Submit</button>
        <button type="reset">Clear fields</button>
        <p><strong>{notif}</strong></p><br/>
      </form>
    </div>
  )
}

export default CreateUser