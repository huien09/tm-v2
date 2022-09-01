import React, { useEffect, useState } from "react"
import Axios from 'axios'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Button, Container, Row, Col } from "react-bootstrap"
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'

function ViewApp() {
  //const [namelabel, setNameLabel] = useState(localStorage.getItem("sysUsername"))
  const navigate = useNavigate()
  let {name} = useParams()
  
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);

  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);
  const handleClose3 = () => setShow3(false);
  const handleClose4 = () => setShow4(false);
  const handleShow = () => setShow(true);
  const handleShow2 = () => setShow2(true);
  const handleShow3 = () => setShow3(true);
  const handleShow4 = () => setShow4(true);

  const [list, setList] = useState([])
  //const [appList, setAppList] = useState([])
  const [planList, setPlanList] = useState([])
  const [taskList, setTaskList] = useState([])
  const [notif, setNotif] = useState("")
  const [notif2, setNotif2] = useState("")
  const [notif3, setNotif3] = useState("")

  const [App_Acronym, setApp_Acronym] = useState(name)
  const [App_Description, setApp_Description] = useState("")
  const [App_Rnumber, setApp_Rnumber] = useState("")
  const [App_startDate, setApp_startDate] = useState("")
  const [App_endDate, setApp_endDate] = useState("")
  const [App_Permit_Create, setApp_Permit_Create] = useState("")
  const [App_Permit_Open, setApp_Permit_Open] = useState("")
  const [App_Permit_toDoList, setApp_Permit_toDoList] = useState("")
  const [App_Permit_Doing, setApp_Permit_Doing] = useState("")
  const [App_Permit_Done, setApp_Permit_Done] = useState("")

  const [Plan_MVP_name, setPlan_MVP_name] = useState("")
  const [Plan_startDate, setPlan_startDate] = useState("")
  const [Plan_endDate, setPlan_endDate] = useState("")
  // const [Plan_app_Acronym, setPlan_app_Acronym] = useState("")

  const [Task_name, setTask_name] = useState("")
  const [Task_description, setTask_description] = useState("")
  const [Task_notes, setTask_notes] = useState("")
  const [Task_id, setTask_id] = useState("")
  const [Task_plan, setTask_plan] = useState("")
  const [Task_app_Acronym, setTask_app_Acronym] = useState(name)
  const [Task_state, setTask_state] = useState("Open")
  const [Task_creator, setTask_creator] = useState(localStorage.getItem("sysUsername"))
  const [Task_owner, setTask_owner] = useState(localStorage.getItem("sysUsername"))
  //const [Task_plan_temp, setTask_plan_temp] = useState("")

  const [sdateDisplay, setSDateDisplay] = useState("")
  const [edateDisplay, setEDateDisplay] = useState("")

  const [permitGroup, setPermitGroup] = useState("")

  const monthTwoD = (month) => {
    return (month < 10 ? '0' : '') + month
  }

  const d = new Date()
  let month =  d.getMonth();
  let currentDate = d.getFullYear() + "-" + (monthTwoD(month + 1)) + "-" + d.getDate()
  let currentDateDisplay = d.getDate() + "-" + (monthTwoD(month + 1)) + "-" + d.getFullYear()

  const [Task_createDate, setTask_createDate] = useState(currentDate)

  //get data for created plans, tasks
  async function getInfo() {
    //e.preventDefault()
    try{
      const response = await Axios.get(`http://localhost:4000/app/`)
      //console.log(response.data)
      setList(response.data[0])
      setPlanList(response.data[1])
      setTaskList(response.data[2])
    } catch (e) {
      if (e.response) {
        console.log(error.response)
      } else {
        console.log('Error', error.message)
      }
    }
  }

  async function fetchAppInfo() {
    try{
      const response = await Axios.get(`http://localhost:4000/app/${name}`, {
         params: {
           app_acronym: name
         }
      })
      console.log(response.data)
      setApp_Description(response.data[0].App_Description)
      setApp_Rnumber(response.data[0].App_Rnumber)
      
      setApp_startDate(response.data[0].startdate)
      let dateTemp = response.data[0].startdate.split("-")
      //console.log(dateTemp[2] + "-" + dateTemp[1] + "-" + dateTemp[0])
      setSDateDisplay(dateTemp[2] + "-" + dateTemp[1] + "-" + dateTemp[0])

      setApp_endDate(response.data[0].enddate)
      let dateTemp2 = response.data[0].enddate.split("-")
      // let dateDisplay2 = dateTemp2[2] + "-" + dateTemp2[1] + "-" + dateTemp2[0]
      //console.log(dateTemp[2] + "-" + dateTemp[1] + "-" + dateTemp[0])
      setEDateDisplay(dateTemp2[2] + "-" + dateTemp2[1] + "-" + dateTemp2[0])

      setApp_Permit_Create(response.data[0].App_permit_Create)
      setApp_Permit_Open(response.data[0].App_permit_Open)
      setApp_Permit_toDoList(response.data[0].App_permit_toDoList)
      setApp_Permit_Doing(response.data[0].App_permit_Doing)
      setApp_Permit_Done(response.data[0].App_permit_Done)

      let rnumTemp = response.data[0].App_Rnumber + 1;
      let idTemp = name + "_" + rnumTemp;
      setTask_id(idTemp);
    } catch (e) {
      if (e.response) {
        console.log(error.response)
      } else {
        console.log('Error', error.message)
      }
    }
  }

  useEffect(() => {getInfo()}, [])
  useEffect(() => {fetchAppInfo()}, [])

  let plans = planList.filter(function(planList) {
    return planList.Plan_app_Acronym === name;
  });

  let tasks = taskList.filter(function(taskList) {
    return taskList.Task_app_Acronym === name;
  });
  
  async function handleUpdateApp(e) {
    e.preventDefault()
    setNotif(" ")
		try {
			const response = await Axios.post('http://localhost:4000/updateapp', {
        App_Acronym, App_Description, App_startDate, App_endDate, App_Permit_Create, App_Permit_Open, App_Permit_toDoList, App_Permit_Doing, App_Permit_Done})
      //console.log(response.data)
      setNotif(response.data)
      setApp_startDate("")
      setApp_endDate("")
      setApp_Permit_Create("")
      setApp_Permit_Open("")
      setApp_Permit_toDoList("")
      setApp_Permit_Doing("")
      setApp_Permit_Done("")
      fetchAppInfo()
		} catch(e) {
			console.log("Error encountered")
		}
  }

  async function handleCreatePlan(e) {
    e.preventDefault()
    setNotif2("")
		try {
			const response = await Axios.post('http://localhost:4000/createplan', {Plan_MVP_name, Plan_startDate, Plan_endDate, App_Acronym})
      //console.log(response.data)
      setNotif2(response.data)
      setPlan_MVP_name("")
      setPlan_startDate("")
      setPlan_endDate("")
      getInfo()
      fetchAppInfo()
		} catch(e) {
			console.log("Error encountered")
		}
  }
  
  async function handleCreateTask(e) {
    e.preventDefault()
    //console.log(Task_name +","+ Task_description +","+ Task_notes +","+ Task_id +","+ Task_plan +","+ Task_app_Acronym +","+ Task_state +","+ Task_creator +","+ Task_owner +","+ Task_owner, Task_createDate);
		try {
			const response = await Axios.post('http://localhost:4000/createtask', {
        Task_name, Task_description, Task_notes, Task_id, Task_plan, Task_app_Acronym, Task_state, Task_creator, Task_owner, Task_createDate, App_Rnumber})
      //console.log(response.data)
      setNotif3(response.data)
      setTask_name("")
      setTask_description("")
      setTask_notes("")
      getInfo()
      //fetchAppInfo()
		} catch(e) {
			console.log("Error encountered")
		}
  }

  async function handleViewTask(taskname) {
    try {
      const response = await Axios.post('http://localhost:4000/viewtask', {Task_name: taskname})
      //console.log(response.data)
      setTask_name(response.data[0].Task_name)
      setTask_description(response.data[0].Task_description)
      setTask_notes(response.data[0].Task_notes)
      setTask_plan(response.data[0].Task_plan)
      // if(response.data[0].Task_plan == ''){
      //    setTask_plan_temp("[Not assigned]")
      // }
      setTask_state(response.data[0].Task_state)
      setTask_creator(response.data[0].Task_creator)
      setTask_owner(response.data[0].Task_owner)

      let dateTemp = response.data[0].Task_createDate.split("-")
      setTask_createDate(dateTemp[2] + "-" + dateTemp[1] + "-" + dateTemp[0])
    } catch(e) {
			console.log("Error encountered")
		}
  }

  async function handlePromoteToDo(taskname, tasknotes, taskstate) {
    //console.log("task:" + taskname + taskstate)
    try {
      const response = await Axios.post('http://localhost:4000/promotetodo', {
        Task_name: taskname, Task_notes: tasknotes, Task_state: taskstate, newState: "toDoList", Task_owner: localStorage.getItem("sysUsername")})
      console.log(response.data)
      getInfo()
    } catch(e) {
			console.log("Error encountered")
		}
  }

  async function handlePromoteDoing(taskname, tasknotes, taskstate) {
    //console.log("task:" + taskname + taskstate)
    try {
      const response = await Axios.post('http://localhost:4000/promotedoing', {
        Task_name: taskname, Task_notes: tasknotes, Task_state: taskstate, newState: "Doing", Task_owner: localStorage.getItem("sysUsername")})
      console.log(response.data)
      getInfo()
    } catch(e) {
			console.log("Error encountered :( ")
		}
  }

  async function handlePromoteDone(taskname, tasknotes, taskstate) {
    //console.log("task:" + taskname +  taskstate)
    try {
      const response = await Axios.post('http://localhost:4000/promotedone', {
        Task_name: taskname, Task_notes: tasknotes, Task_state: taskstate, newState: "Done", Task_owner: localStorage.getItem("sysUsername")})
      //console.log(response.data[0].Task_creator)
      let receiver = response.data[0].Task_creator
      //console.log(receiver)
      getInfo()
      handleEmail(taskname, receiver)
    } catch(e) {
			console.log("Error encountered")
		}
  }

  async function handlePromoteClose(taskname, tasknotes, taskstate) {
    //console.log("task:" + taskname + taskstate)
    try {
      const response = await Axios.post('http://localhost:4000/promoteclose', {
        Task_name: taskname, Task_notes: tasknotes, Task_state: taskstate, newState: "Close", Task_owner: localStorage.getItem("sysUsername")})
      console.log(response.data)
      getInfo()
    } catch(e) {
			console.log("Error encountered")
		}
  }

  async function handleEmail(taskname, receiver) {
    try {
      const response = await Axios.post('http://localhost:4000/sendemail', {
        Task_name: taskname, sender: localStorage.getItem("sysUsername"), receiver})
      console.log(response.data)
    } catch(e) {
			console.log("Error encountered")
		}
  }

  function setPermits() {
    if (localStorage.getItem("permitGroup") == '1') {
      setPermitGroup("project manager")
    } else if (localStorage.getItem("permitGroup") == '2') {
      setPermitGroup("project lead")
    } else if (localStorage.getItem("permitGroup") == '3') {
      setPermitGroup("team member")
    }
  }

  useEffect(() => {setPermits()}, [])

  return (
    <>
      <div className="container container--narrow py-md-3">
        <Container>
          <Button variant="secondary" size="sm" onClick={() => navigate(-1)} type="submit">Back</Button><br/>
            <label>Application: </label>{" "}
            <label style={{fontSize: '19px', fontWeight: 'bold'}}>{App_Acronym}</label><br/>
            {/* <label>Description: </label><br/>
            <textarea name="description" placeholder="Description" cols="40" defaultValue={App_Description}/> */}
            {/* <label>R Number: {App_Rnumber}</label><br/> */}
            <label>Start Date: {sdateDisplay} ~ End Date: {edateDisplay}</label><br/>
          {/* <Row xs={5}>
            <Col>
            <label>Permit create: {App_Permit_Create}</label><br/>
            </Col>
            <Col>
            <label>Permit open: {App_Permit_Open}</label><br/>
            </Col>
            <Col>
            <label>Permit toDoList: {App_Permit_toDoList}</label><br/>
            </Col>
            <Col>
            <label>Permit doing: {App_Permit_Doing}</label><br/>
            </Col>
            <Col>
            <label>Permit done: {App_Permit_Done}</label><br/>
            </Col>
          </Row> */}
          <br/>
          {/*----------------------------------------------------page break-----------------------------------------------------*/}
          {/* {permitGroup != "team member" ? ( */}
          <Button onClick={handleShow} variant="success">Edit Application</Button>
          {/* <Button onClick={handleShow} variant="success" disabled>Edit Application</Button>   */}
          
          {" "}
          {permitGroup === "project manager" ? (
          <Button onClick={handleShow2}>Create Plan</Button>) : (
            <Button disabled>Create Plan</Button>
          )}{" "}
          {permitGroup === App_Permit_Create ? (
          <Button onClick={handleShow3}>Create Task</Button>) : (
            <Button disabled>Create Task</Button>) }{" "}
          {/* <Button size="sm" onClick={() => handleEmail("noodles","user22")}>test button</Button> */}
          <br/><br/>
          <Row xs={6}>
            <Col>
            <h5>Plan</h5>
            {plans.map((data,i) => (
              <div key={i}>
                {/* {data.Plan_app_Acronym === name ? ( */}
                <Card style={{ width: '8rem', height:'6rem', backgroundColor: 'azure' }}>
                  <Card.Body>
                    <Card.Title>{data.Plan_MVP_name}</Card.Title>
                    {/* <Card.Link href="#">Edit</Card.Link> */}
                  </Card.Body>
                </Card>
                {/* ) : null} */}
              </div>
            ))}
            </Col>
            <Col>
            Open
            {tasks.map((data,i) => (
              <div key={i}>
              {data.Task_state === "Open" ? (
              <Card border="" style={{ width: '9rem', height:'9rem', backgroundColor: 'lavenderblush' }}>
                <Card.Body>
                  <Card.Title>{data.Task_name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{data.Task_plan}</Card.Subtitle>
                  <Row>
                    <Col>
                    <Button variant="primary" size="sm" onClick={() => {
                      handleShow4(); 
                      handleViewTask(data.Task_name);
                    }}>View</Button>{" "}
                    {/* </Col>
                    <Col> */}
                    {permitGroup === App_Permit_Open ? (
                    <Link to={`/Task/${data.Task_name}`} style={{textDecoration:"none"}}><Button variant="success" size="sm" >Edit</Button></Link>) :
                    (<Button variant="success" size="sm" disabled >Edit</Button>)}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                    {permitGroup === App_Permit_Open ? (
                    <Button variant="primary" size="sm" onClick={() => handlePromoteToDo(data.Task_name, data.Task_notes, data.Task_state)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                      </svg>
                    </Button>) : (
                      null
                    )}
                    </Col>
                  </Row>
                  {/* <Card.Link href="#">To do list</Card.Link> */}
                </Card.Body>
              </Card>
              ) : null}
              </div>
            ))}
            </Col>
            <Col>To Do List
            {tasks.map((data,i) => (
              <div key={i}>
              {data.Task_state === "toDoList" ? (
              <Card border="" style={{ width: '10rem', height:'9rem', backgroundColor: 'lavenderblush' }}>
                <Card.Body>
                  <Card.Title>{data.Task_name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{data.Task_plan}</Card.Subtitle>
                  <Button variant="primary" size="sm" onClick={() => {
                    handleShow4(); 
                    handleViewTask(data.Task_name);
                  }}>View</Button>{" "}
                  {permitGroup === App_Permit_toDoList ? (
                    <Link to={`/Task/${data.Task_name}`} style={{textDecoration:"none"}}><Button variant="success" size="sm" >Edit</Button></Link>) :
                  (<Button variant="success" size="sm" disabled >Edit</Button>)}
                  {permitGroup === App_Permit_toDoList ? (
                    <Button variant="primary" size="sm" onClick={() => handlePromoteDoing(data.Task_name, data.Task_notes, data.Task_state)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                    </svg>
                  </Button>) : (
                    null
                  )}
                </Card.Body>
              </Card>
              ) : null}
              </div>
            ))}
            </Col>
            <Col>Doing
            {tasks.map((data,i) => (
              <div key={i}>
              {data.Task_state === "Doing" ? (
              <Card border="" style={{ width: '10rem', height:'9rem', backgroundColor: 'lavenderblush' }}>
                <Card.Body>
                  <Card.Title>{data.Task_name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{data.Task_plan}</Card.Subtitle>
                  <Button variant="primary" size="sm" onClick={() => {
                      handleShow4(); 
                      handleViewTask(data.Task_name);
                    }}>View</Button>{" "}
                  {permitGroup === App_Permit_Doing ? (
                    <Link to={`/Task/${data.Task_name}`} style={{textDecoration:"none"}}><Button variant="success" size="sm" >Edit</Button></Link>) :
                    (<Button variant="success" size="sm" disabled >Edit</Button>)}
                  {/* left arrow */}
                  {permitGroup === App_Permit_Doing ? (
                  <Button variant="primary" size="sm" onClick={() => handlePromoteToDo(data.Task_name, data.Task_notes, data.Task_state)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                  </svg>
                  </Button>) : (null)}{" "}
                  {/* right arrow */}
                  {permitGroup === App_Permit_Doing ? (
                  <Button variant="primary" size="sm" onClick={() => handlePromoteDone(data.Task_name, data.Task_notes, data.Task_state)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                  </svg>
                  </Button>) : (null)}
                </Card.Body>
              </Card>
              ) : null}
              </div>
            ))}
            </Col>
            <Col>Done
            {tasks.map((data,i) => (
              <div key={i}>
              {data.Task_state === "Done" ? (
              <Card border="" style={{ width: '10rem', height:'9rem', backgroundColor: 'lavenderblush' }}>
                <Card.Body>
                  <Card.Title>{data.Task_name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{data.Task_plan}</Card.Subtitle>
                  <Button variant="primary" size="sm" onClick={() => {
                      handleShow4(); 
                      handleViewTask(data.Task_name);
                    }}>View</Button>{" "}
                  {permitGroup === App_Permit_Done ? (
                    <Link to={`/Task/${data.Task_name}`} style={{textDecoration:"none"}}><Button variant="success" size="sm" >Edit</Button></Link>) :
                    (<Button variant="success" size="sm" disabled >Edit</Button>)}
                  {/* left arrow */}
                  {permitGroup === App_Permit_Done ? (
                  <Button variant="primary" size="sm" onClick={() => handlePromoteDoing(data.Task_name, data.Task_notes, data.Task_state)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                  </svg>
                  </Button>) : (null)}{" "}
                  {/* right arrow */}
                  {permitGroup === App_Permit_Done ? (
                  <Button variant="primary" size="sm" onClick={() => handlePromoteClose(data.Task_name, data.Task_notes, data.Task_state)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                  </svg>
                  </Button>) : (null)}
                </Card.Body>
              </Card>
              ) : null}
              </div>
            ))}
            </Col>
            <Col>Close
            {tasks.map((data,i) => (
              <div key={i}>
              {data.Task_state === "Close" ? (
              <Card border="" style={{ width: '9rem', height:'9rem', backgroundColor: 'lavenderblush' }}>
                <Card.Body>
                  <Card.Title>{data.Task_name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{data.Task_plan}</Card.Subtitle>
                  <Button variant="primary" size="sm" onClick={() => {
                    handleShow4(); 
                    handleViewTask(data.Task_name);
                  }}>View</Button>{" "}
                </Card.Body>
              </Card>
              ) : null}
              </div>
            ))}
            </Col>
            <Col>
            {/* <Toast onClose={() => setShowtoast(false)} showtoast={showtoast} delay={3000} autohide>
              <Toast.Header>
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto">Bootstrap</strong>
                <small>11 mins ago</small>
              </Toast.Header>
              <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
            </Toast> */}
            </Col>
          </Row>
          
          <Modal show={show}
          onHide={handleClose}
          backdrop={true}
          keyboard={false} 
          size="lg">

          <Modal.Header closeButton>
            <Modal.Title>Edit Application</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="secondary">{notif}</Alert>
          <Container>
              <label>Application Name:</label><br/>
              <input type="text" name="appname" placeholder="Application name" defaultValue={App_Acronym} readOnly /><br/>
              <label>Description: </label><br/>
              <textarea onChange={e => setApp_Description(e.target.value)} name="description" placeholder="Description" rows="8" cols="85" defaultValue={App_Description} />
            <Row>
              <Col>
              <label>R Number: </label><br/>
              <input type="number" name="rnumber" placeholder="R Number" defaultValue={App_Rnumber} readOnly /><br/>
              </Col>
              <Col>
              <label>Start Date: </label><br/>
              <input onChange={e => setApp_startDate(e.target.value)} type="date" name="appstartdate" defaultValue={App_startDate} />
              </Col>
              <Col>
              <label>End Date: </label><br/>
              <input onChange={e => setApp_endDate(e.target.value)} type="date" name="appenddate" defaultValue={App_endDate} />
              </Col>
            </Row>
            <Row>
              <Col>
              <label>Permit create: {App_Permit_Create}</label><br/>
              {/* <input onChange={e => setApp_Permit_Create(e.target.value)} type="text" placeholder="User group" /><br/> */}
              <select onChange={e => setApp_Permit_Create(e.target.value)} name="usergroup11">
                <option value="">--Select--</option>
                {list.map((option, i) => (
                  <option key={i} value={option.groupname}>{option.groupname}</option>
                ))}
              </select>
              </Col>
              <Col>
              <label>Permit open: {App_Permit_Open}</label><br/>
              {/* <input onChange={e => setApp_Permit_Open(e.target.value)} type="text" placeholder="User group" /><br/> */}
              <select onChange={e => setApp_Permit_Open(e.target.value)} name="usergroup12">
                <option value="">--Select--</option>
                {list.map((option, i) => (
                  <option key={i} value={option.groupname}>{option.groupname}</option>
                ))}
              </select>
              </Col>
              <Col>
              <label>Permit toDoList: {App_Permit_toDoList}</label><br/>
              {/* <input onChange={e => setApp_Permit_toDoList(e.target.value)} type="text" placeholder="User group" /><br/> */}
              <select onChange={e => setApp_Permit_toDoList(e.target.value)} name="usergroup13">
                <option value="">--Select--</option>
                {list.map((option, i) => (
                  <option key={i} value={option.groupname}>{option.groupname}</option>
                ))}
              </select>
              </Col>
            </Row>
            <Row>
              <Col>
              <label>Permit doing: {App_Permit_Doing}</label><br/>
              {/* <input onChange={e => setApp_Permit_Doing(e.target.value)} type="text" placeholder="User group" /><br/> */}
              <select onChange={e => setApp_Permit_Doing(e.target.value)} name="usergroup14">
                <option value="">--Select--</option>
                {list.map((option, i) => (
                  <option key={i} value={option.groupname}>{option.groupname}</option>
                ))}
              </select>
              </Col>
              <Col>
              <label>Permit done: {App_Permit_Done}</label><br/>
              {/* <input onChange={e => setApp_Permit_Done(e.target.value)} type="text" placeholder="User group" /><br/> */}
              <select onChange={e => setApp_Permit_Done(e.target.value)} name="usergroup15">
                <option value="">--Select--</option>
                {/* <option value="project manager">Project manager</option>
                <option value="project lead">Project lead</option>
                <option value="team member">Team member</option> */}
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
            <Button onClick={handleClose} variant="secondary">Close</Button>
            {permitGroup != "team member" ? (
            <Button onClick={handleUpdateApp} variant="primary">Save</Button>) : (
              <Button onClick={handleUpdateApp} variant="primary" disabled>Save</Button>
            )}
          </Modal.Footer>
          </Modal>

          <Modal show={show2}
          onHide={handleClose2}
          backdrop={true}
          keyboard={false}>

          <Modal.Header closeButton>
            <Modal.Title>Create Plan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="secondary">{notif2}</Alert>
            <form>
              <label>Plan Name:</label><br/>
              <input onChange={e => setPlan_MVP_name(e.target.value)} value={Plan_MVP_name} type="text" name="planname" placeholder="Plan name" required autoComplete="off" /><br/>
              <label>Start Date: </label><br/>
              <input onChange={e => setPlan_startDate(e.target.value)} value={Plan_startDate} type="date" name="planstartdate" required /><br/>
              <label>End Date: </label><br/>
              <input onChange={e => setPlan_endDate(e.target.value)} value={Plan_endDate} type="date" name="planenddate" required /><br/>
              {/* <label>Application: {App_Acronym}</label><br/> */}
              {/* <input type="text" name="appname" placeholder="Application name" defaultValue={App_Acronym} readOnly/><br/> */}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose2} variant="secondary">Close</Button>
            <Button onClick={handleCreatePlan} variant="primary">Create</Button>
          </Modal.Footer>
          </Modal>
          
          <Modal show={show3}
          onHide={handleClose3}
          backdrop={true}
          keyboard={false}
          size="lg">

          <Modal.Header closeButton>
            <Modal.Title>Create Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="secondary">{notif3}</Alert>
            <Container>
            <label>Task Name:</label><br/>
            <input onChange={e => setTask_name(e.target.value)} value={Task_name} type="text" name="task_name" placeholder="Task name" required autoComplete="off" /><br/>
            <label>Description:</label><br/>
            <textarea onChange={e => setTask_description(e.target.value)} value={Task_description} name="task_description" placeholder="Description" rows="5" cols="85" /><br/>
            <label>Notes:</label><br/>
            <textarea onChange={e => setTask_notes(e.target.value)} value={Task_notes} name="task_notes" placeholder="Notes" rows="5" cols="85" /><br/>
              <Row>  
                <Col>
                <label>Task ID:</label><br/>
                <input type="text" name="task_id" defaultValue={Task_id} readOnly /><br/>
                </Col>
                <Col>
                <label>Assign to Plan:</label><br/>
                <select onChange={e => setTask_plan(e.target.value)} name="usergroup31" placeholder="Select Plan">
                  <option value=" ">--Select--</option>
                  {plans.map((option, i) => (
                    <option key={i} value={option.Plan_MVP_name}>{option.Plan_MVP_name}</option>
                  ))}
                </select>
                </Col>
                {/* <label>Assign to Application:</label><br/> */}
                {/* <select onChange={e => setTask_app_Acronym(e.target.value)} name="usergroup32" placeholder="Select Application">
                  <option> </option>
                  {appList.map((option, i) => (
                    <option key={i} value={option.App_Acronym}>{option.App_Acronym}</option>
                  ))}
                </select> */}
                <Col>
                <label>Assign state:</label><br/>
                <input type="text" name="task_state" defaultValue={Task_state} readOnly />
                {/* <select onChange={e => setTask_state(e.target.value)} name="task_state" defaultValue="Open" >
                  <option value="Open">Open</option>
                  <option value="toDoList">toDoList</option>
                  <option value="Doing">Doing</option>
                  <option value="Done">Done</option>
                </select> */}
                </Col>
              </Row>
              <Row>
                <Col>
                <label>Task Creator:</label><br/>
                <input type="text" name="task_creator" defaultValue={Task_creator} readOnly />
                </Col>
                <Col>
                <label>Task Owner:</label><br/>
                <input onChange={e => setTask_owner(e.target.value)} type="text" name="task_owner" placeholder="Owner name" defaultValue={Task_owner} readOnly />
                </Col>
                <Col>
                <label>Task Created Date:</label><br/>
                <input type="text" name="task_createdate" placeholder="Date" defaultValue={currentDateDisplay} readOnly />
                </Col>
              </Row>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose3} variant="secondary">Close</Button>
            <Button onClick={handleCreateTask} variant="primary">Create</Button>
          </Modal.Footer>
          </Modal>
          
          <Modal show={show4}
          onHide={handleClose4}
          backdrop={true}
          keyboard={false}
          size="lg">

          <Modal.Header closeButton>
            <Modal.Title>View Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <Alert variant="secondary">{notif2}</Alert> */}
            <form>
              <label>Task Name: {Task_name}</label><br/>
              {/* <label>Task: </label><br/>
              <input type="text" name="task_name" defaultValue={Task_name} readOnly /><br/> */}
              <label>Description: </label><br/>
              <textarea name="task_description" placeholder="Description" rows="5" cols="85" defaultValue={Task_description} readOnly /><br/>
              <label>Notes: </label><br/>
              <textarea name="task_notes" placeholder="Notes" rows="5" cols="85" defaultValue={Task_notes} readOnly/><br/>
              <Row>
                <Col>
                <label>Plan: {Task_plan}</label><br/>
                </Col>
                <Col>
                <label>State: {Task_state}</label><br/>
                </Col>
                <Col>
                </Col>
              </Row>
              <Row>
                <Col>
                <label>Task Owner: {Task_owner}</label><br/>
                </Col>
                <Col>
                <label>Task Creator: {Task_creator}</label><br/>
                </Col>
                <Col>
                <label>Task Created Date: {Task_createDate}</label><br/>
                </Col>
              </Row>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose4} variant="secondary">Close</Button>
          </Modal.Footer>
          </Modal>

        </Container>
      </div>
    </>
  )
}

export default ViewApp