import React, { useState } from "react"
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button, Container, Row, Col } from "react-bootstrap"

function Logout(props) {
	const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [notif, setNotif] = useState("")
  var navigate = useNavigate()
	
	async function handleSubmit(e) {
		e.preventDefault()
		try {
			const response = await Axios.post('http://localhost:4000/auth', {username: username, password: password})
      console.log(response.data)
      if (response.data.length > 0){
        //console.log(response.data)
        //props.setLoggedIn(true)
        localStorage.setItem("sysUsername", response.data[0])
        localStorage.setItem("userToken", response.data[1])
        localStorage.setItem("permitGroup", response.data[2])
        let loggedIn = localStorage.getItem("userToken")
        //console.log(loggedIn)
        if(loggedIn == "1"){
           navigate("/Home")
        } else if (loggedIn == "0"){
           navigate("/HomeUser")
        }
      } else {
        setNotif("Incorrect Username and/or Password!")
      }
      setUsername(e.target.reset())
      setPassword(e.target.reset())
		} catch(e) {
			console.log("Error encountered")
		}
  }

  const styles = {
    padding: "30px 30px 30px 50px",
    backgroundColor: "paleturquoise",
    // alignItems: "center"
  }

  return (
    <div className="row align-items-center">
      <form onSubmit={handleSubmit} style={styles}>
        <h3>Task Management System | Login</h3><br/>
        <Row>
          <Col>
          <label>Username:</label>
          {/* </Col> */}
          {/* <Col xs={1} md={1} lg={1}> */}
          <input onChange={e => setUsername(e.target.value)} type="text" name="username" placeholder="Username" id="username" required autoComplete="off" style={{padding: "2px"}} />
          </Col>
        </Row>
        <Row>
          {/* <Col xs={1} md={1} lg={1}> */}
          <Col>
          <label>Password:</label>{" "}
          <input onChange={e => setPassword(e.target.value)} type="password" name="password" placeholder="Password" id="password" required autoComplete="off" style={{padding: "2px"}} />
          <button type="submit">Login</button><br/>
          </Col>
        </Row>
        <label><strong>{notif}</strong></label>
      </form>
    </div>
  )

}

export default Logout