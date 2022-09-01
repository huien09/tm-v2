import React, { useEffect, useState } from "react"
import Axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Container, Row, Col } from "react-bootstrap"
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'

function HomeUser() {
  const [namelabel, setNameLabel] = useState(localStorage.getItem("sysUsername"))
  var navigate = useNavigate()

  const [show, setShow] = useState(false);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [App_Acronym, setApp_Acronym] = useState("")
  const [App_Description, setApp_Description] = useState("")
  const [App_Rnumber, setApp_Rnumber] = useState("")
  const [App_startDate, setApp_startDate] = useState("")
  const [App_endDate, setApp_endDate] = useState("")
  const [App_Permit_Create, setApp_Permit_Create] = useState("")
  const [App_Permit_Open, setApp_Permit_Open] = useState("")
  const [App_Permit_toDoList, setApp_Permit_toDoList] = useState("")
  const [App_Permit_Doing, setApp_Permit_Doing] = useState("")
  const [App_Permit_Done, setApp_Permit_Done] = useState("")

  const [list, setList] = useState([]) //for display in dropdown
  const [appList, setAppList] = useState([])
  //const [planList, setPlanList] = useState([])
  //const [taskList, setTaskList] = useState([])
  const [notif, setNotif] = useState("") //display msgs under Alert
  const [temp, setTemp] = useState([])

  const [permitGroup, setPermitGroup] = useState("")

  function handleLogout() {
    //props.setLoggedIn(false)
    //localStorage.removeItem("sysUsername")
    //localStorage.removeItem("userToken")
    localStorage.clear()
    navigate("/")
  }

  //get data for created application
  async function getInfo() {
    //e.preventDefault()
    try{
      const response = await Axios.get('http://localhost:4000/homeuser')
      //console.log(response.data[0])
      setList(response.data[0])
      setAppList(response.data[1])
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
    setNotif(" ")
		try {
			const response = await Axios.post('http://localhost:4000/createapp', {App_Acronym, App_Description, App_Rnumber, App_startDate, App_endDate, App_Permit_Create, App_Permit_Open, App_Permit_toDoList, App_Permit_Doing, App_Permit_Done})
      //console.log(response.data)
      setNotif(response.data)
      setApp_Acronym("")
      setApp_Description("")
      setApp_Rnumber("")
      setApp_startDate("")
      setApp_endDate("")
      setApp_Permit_Create("")
      setApp_Permit_Open("")
      setApp_Permit_toDoList("")
      setApp_Permit_Doing("")
      setApp_Permit_Done("")
      getInfo()
		} catch(e) {
			console.log("Error encountered")
		}
  }

  function setPermits() {
    if (localStorage.getItem("permitGroup") == '1') {
      setPermitGroup("project manager")
    } else if (localStorage.getItem("permitGroup") == '2') {
      setPermitGroup("project lead")
    } else {
      setPermitGroup("team member")
    }
  }

  useEffect(() => {setPermits()}, [])

  return (
    <>
      <div className="container container--narrow py-md-3">
        <title>Home</title>
        <label>Welcome, <strong>{namelabel}</strong> <button onClick={handleLogout}>Log out</button></label>{" "}
        <label> Settings: </label>{" "}
        <Link to="/ChangePassword">Change Password</Link>{" | "}
        <Link to="/UpdateEmail">Update Email</Link><br/><br/>
        {/* {temp.map((data,i) => (
            <ul key={i}>
              <div>{data.App_Acronym}_{data.App_Rnumber + 1}</div>
            </ul>
          ))} */}
        <Container>
        {permitGroup != "team member" ? (
        <Button onClick={handleShow} variant="primary">Create Application</Button>) : ( 
          <Button variant="primary" disabled>Create Application</Button>
         )}
        <br/><br/>
        <h5>Application</h5>
          <Row xs={8}>
          {appList.map((data,i) => ( 
            <Col xs={2} md={8} lg={2} key={i}>
            <Card style={{ backgroundColor: "azure" }}>
              <Card.Body>
                <Card.Title>{data.App_Acronym}</Card.Title>
                {/* <Card.Text>
                  Some quick example text.
                </Card.Text> */}
                {/* <Card.Subtitle>{data.App_Acronym}</Card.Subtitle> */}
                <Link to={`/App/${data.App_Acronym}`} style={{textDecoration:"none"}}><Button variant="primary" size="sm" style={{fontSize: '14px'}}>View</Button></Link>
                {/* <Card.Link href="/EditApp/:id">View</Card.Link> */}
                {/* <Button onClick={handleViewApp} variant="primary" size="sm">View</Button> */}
              </Card.Body>
            </Card>
            </Col>
            ))} 
          </Row>
        </Container>
        {/****************************************modal break***********************************************/}
        <Modal show={show}
        onHide={handleClose}
        backdrop={true}
        keyboard={false} 
        size="lg">

        <Modal.Header closeButton>
          <Modal.Title>Create Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="secondary">{notif}</Alert>
        <Container>
            <label>Application Name:</label><br/>
            <input onChange={e => setApp_Acronym(e.target.value)} type="text" name="appname" placeholder="Application Name" id="app_acronym" required autoComplete="off" defaultValue={App_Acronym} /><br/>
            <label>Description: </label><br/>
            <textarea onChange={e => setApp_Description(e.target.value)} name="description" placeholder="Description" rows="8" cols="85" value={App_Description} />
          <Row>
            <Col>
            <label>R Number: </label><br/>
            <input onChange={e => setApp_Rnumber(e.target.value)} type="number" name="rnumber" placeholder="R Number" required min={1} value={App_Rnumber} /><br/>
            </Col>
            <Col>
            <label>Start Date: </label><br/>
            <input onChange={e => setApp_startDate(e.target.value)} type="date" name="appstartdate" value={App_startDate} />
            </Col>
            <Col>
            <label>End Date: </label><br/>
            <input onChange={e => setApp_endDate(e.target.value)} type="date" name="appenddate" value={App_endDate} />
            </Col>
          </Row>
          <Row>
            <Col>
            <label>Permit create: </label><br/>
            {/* <input onChange={e => setApp_Permit_Create(e.target.value)} type="text" placeholder="User group" /><br/> */}
            <select onChange={e => setApp_Permit_Create(e.target.value)} name="usergroup11" value={App_Permit_Create}>
              <option value="">--Select--</option>
              {list.map((option, i) => (
                <option key={i} value={option.groupname}>{option.groupname}</option>
              ))}
            </select>
            </Col>
            <Col>
            <label>Permit open: </label><br/>
            {/* <input onChange={e => setApp_Permit_Open(e.target.value)} type="text" placeholder="User group" /><br/> */}
            <select onChange={e => setApp_Permit_Open(e.target.value)} name="usergroup12" value={App_Permit_Open}>
              <option value="">--Select--</option>
              {list.map((option, i) => (
                <option key={i} value={option.groupname}>{option.groupname}</option>
              ))}
            </select>
            </Col>
            <Col>
            <label>Permit toDoList: </label><br/>
            {/* <input onChange={e => setApp_Permit_toDoList(e.target.value)} type="text" placeholder="User group" /><br/> */}
            <select onChange={e => setApp_Permit_toDoList(e.target.value)} name="usergroup13" value={App_Permit_toDoList}>
              <option value="">--Select--</option>
              {list.map((option, i) => (
                <option key={i} value={option.groupname}>{option.groupname}</option>
              ))}
            </select>
            </Col>
          </Row>
          <Row>
            <Col>
            <label>Permit doing: </label><br/>
            {/* <input onChange={e => setApp_Permit_Doing(e.target.value)} type="text" placeholder="User group" /><br/> */}
            <select onChange={e => setApp_Permit_Doing(e.target.value)} name="usergroup14" value={App_Permit_Doing}>
              <option value="">--Select--</option>
              {list.map((option, i) => (
                <option key={i} value={option.groupname}>{option.groupname}</option>
              ))}
            </select>
            </Col>
            <Col>
            <label>Permit done: </label><br/>
            {/* <input onChange={e => setApp_Permit_Done(e.target.value)} type="text" placeholder="User group" /><br/> */}
            <select onChange={e => setApp_Permit_Done(e.target.value)} name="usergroup15" value={App_Permit_Done}>
              <option value="">--Select--</option>
              {list.map((option, i) => (
                <option key={i} value={option.groupname}>{option.groupname}</option>
              ))}
            </select>
            </Col>
            <Col></Col>
          </Row>
        </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button onClick={handleCreateapp} variant="primary">Create</Button>
        </Modal.Footer>
        </Modal>

      </div>
      <div className="component">
      </div>
    </>
  )
}

export default HomeUser