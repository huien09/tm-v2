import React, { useEffect, useState } from "react"
import Axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "react-bootstrap"
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import ThemeSwitcher from "./ThemeSwitcher"

function HomeUser() {
  const [namelabel, setNameLabel] = useState(localStorage.getItem("sysUsername"))
  var navigate = useNavigate()

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);
  //const handleClose3 = () => setShow3(false);
  const handleShow = () => setShow(true);
  const handleShow2 = () => setShow2(true);

  const [App_Acronym, setApp_Acronym] = useState("")
  const [App_Description, setApp_Description] = useState("")
  const [App_Rnumber, setApp_Rnumber] = useState("")
  const [App_startDate, setApp_startDate] = useState("")
  const [App_endDate, setApp_endDate] = useState("")
  const [App_Permit_Open, setApp_Permit_Open] = useState("")
  const [App_Permit_toDoList, setApp_Permit_toDoList] = useState("")
  const [App_Permit_Doing, setApp_Permit_Doing] = useState("")
  const [App_Permit_Done, setApp_Permit_Done] = useState("")

  const [data, setData] = useState([])
  const [notif, setNotif] = useState([])

  function handleLogout() {
    //props.setLoggedIn(false)
    localStorage.removeItem("sysUsername")
    localStorage.removeItem("userToken")
    navigate("/")
  }

  async function getInfo() {
    //e.preventDefault()
    try{
      const response = await Axios.get('http://localhost:4000/homeuser')
      console.log(response)
      setData(response)
    } catch (e) {
      if (e.response) {
        console.log(error.response)
      } else {
        console.log('Error', error.message)
      }
    }
  }

  useEffect(() => {getInfo()}, [])

  async function handleCreateapp(e) {
    e.preventDefault()
		try {
			const response = await Axios.post('http://localhost:4000/createapp', {App_Acronym, App_Description, App_Rnumber, App_startDate, App_endDate, App_Permit_Open, App_Permit_toDoList, App_Permit_Doing, App_Permit_Done})
      console.log(response.data)
      setNotif(response.data)
      console.log(notif)
      //    console.log("Hello!")
		} catch(e) {
			console.log("Error encountered")
		}
  }

  return (
    <>
      <div className="container container--narrow py-md-5">
        <title>Home</title>
        <label>Welcome, <strong>{namelabel}</strong></label>
        <button onClick={handleLogout}>Log out</button>
        <label> Settings: </label>
        <Link to="/ChangePassword">Change Password</Link>{" | "}
        <Link to="/UpdateEmail">Update Email</Link>
        <p>Create App-create plan-create task</p>
        <Button onClick={handleShow} variant="primary">Create Application</Button><br/>
        <Button onClick={handleShow2} variant="outline-primary">Create Plan</Button>
        {/* <Button onClick={handleShow} variant="outline-primary">Create Task</Button> */}
        <Modal show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}>

        <Modal.Header closeButton>
          <Modal.Title>Create Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Alert variant="primary">{notif}</Alert> */}
        <form>
          <label>Application Name:</label><br/>
          <input onChange={e => setApp_Acronym(e.target.value)} type="text" name="appname" placeholder="Username" id="username" required autoComplete="off" /><br/>
          <label>Description: </label><br/>
          <textarea onChange={e => setApp_Description(e.target.value)} name="description" placeholder="Description" cols="30" /><br/>
          <label>R Number: </label><br/>
          <input onChange={e => setApp_Rnumber(e.target.value)} type="number" name="rnumber" placeholder="R Number" min={1} /><br/>
          <label>Start Date: </label><br/>
          <input onChange={e => setApp_startDate(e.target.value)} type="date" name="startdate" /><br/>
          <label>End Date: </label><br/>
          <input onChange={e => setApp_endDate(e.target.value)} type="date" name="enddate" /><br/>
          <label>Permit open: </label><br/>
          <input onChange={e => setApp_Permit_Open(e.target.value)} type="text" placeholder="User group" /><br/>
          <label>Permit toDoList: </label><br/>
          <input onChange={e => setApp_Permit_toDoList(e.target.value)} type="text" placeholder="User group" /><br/>
          <label>Permit doing: </label><br/>
          <input onChange={e => setApp_Permit_Doing(e.target.value)} type="text" placeholder="User group" /><br/>
          <label>Permit done: </label><br/>
          <input onChange={e => setApp_Permit_Done(e.target.value)} type="text" placeholder="User group" /><br/>
        </form> 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleCreateapp} variant="primary">Create</Button>
        </Modal.Footer>

        </Modal>
        <Modal show={show2}
        onHide={handleClose2}
        backdrop="static"
        keyboard={false}>

        <Modal.Header closeButton>
          <Modal.Title>Create Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <label>Plan Name:</label><br/>
            <input onChange={e => setUsername(e.target.value)} type="text" name="username" placeholder="Username" id="username" required autoComplete="off" /><br/>
            <label>Start Date: </label><br/>
            <input type="date" name="startdate" /><br/>
            <label>End Date: </label><br/>
            <input type="date" name="enddate" /><br/>
            <label>Application:</label><br/>
            <input type="text" placeholder="Application Name" />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="primary">Create</Button>
        </Modal.Footer>

        </Modal>
      </div>
      <div className="component">
      </div>
    </>
  )
}

export default HomeUser