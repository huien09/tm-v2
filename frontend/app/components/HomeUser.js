import React, { useEffect, useState } from "react"
import Axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "react-bootstrap"
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'

function HomeUser() {
  const [namelabel, setNameLabel] = useState(localStorage.getItem("sysUsername"))
  var navigate = useNavigate()

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);
  const handleClose3 = () => setShow3(false);
  const handleShow = () => setShow(true);
  const handleShow2 = () => setShow2(true);
  const handleShow3 = () => setShow3(true);

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

  const [list1, setList1] = useState([]) //for display in dropdown
  const [list2, setList2] = useState([])
  const [list3, setList3] = useState([])
  const [notif, setNotif] = useState("") //display msgs under Alert
  const [tag, setTag] = useState([])

  const [Plan_MVP_name, setPlan_MVP_name] = useState("")
  const [Plan_startDate, setPlan_startDate] = useState("")
  const [Plan_endDate, setPlan_endDate] = useState("")
  const [Plan_app_Acronym, setPlan_app_Acronym] = useState("")

  const [Task_name, setTask_name] = useState("")
  const [Task_description, setTask_description] = useState("")
  const [Task_notes, setTask_notes] = useState("")
  const [Task_id, setTask_id] = useState("")
  const [Task_plan, setTask_plan] = useState("")
  const [Task_app_Acronym, setTask_app_Acronym] = useState("")
  const [Task_state, setTask_state] = useState("")
  const [Task_creator, setTask_creator] = useState("")
  const [Task_owner, setTask_owner] = useState("")
  const [Task_createDate, setTask_createDate] = useState("")

  const d = new Date()
  let currentDate = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()

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
      console.log(response.data)
      setList1(response.data[0])
      setList2(response.data[1])
      setList3(response.data[2])
      //get data for created application
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
			const response = await Axios.post('http://localhost:4000/createapp', {App_Acronym, App_Description, App_Rnumber, App_startDate, App_endDate, App_Permit_Create, App_Permit_Open, App_Permit_toDoList, App_Permit_Doing, App_Permit_Done})
      console.log(response.data)
      setNotif(response.data)
      // if ((response.data).includes("created")) {
      //   console.log("true")
      //   tag.push(App_Acronym)
      // }
		} catch(e) {
			console.log("Error encountered")
		}
  }

  async function handleCreateplan(e) {
    e.preventDefault()
    setNotif("")
		try {
			const response = await Axios.post('http://localhost:4000/createplan', {Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_app_Acronym})
      console.log(response.data)
      setNotif(response.data)
		} catch(e) {
			console.log("Error encountered")
		}
  }

  async function handleCreatetask(e) {
    e.preventDefault()
		try {
			const response = await Axios.post('http://localhost:4000/createtask', {Task_name, Task_description, Task_notes, Task_id, Task_plan, Task_app_Acronym, Task_state, Task_creator, Task_owner, Task_createDate})
      console.log(response.data)
      //setNotif(response.data)
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
        <Button onClick={handleShow3} variant="outline-primary">Create Task</Button>
        {/* {list.map((data,i) => (
            <ul key={i}>
              <div>{data.groupname}</div>
            </ul>
          ))} */}
        {list2.map((data,i) => (
            <ul key={i}>
              <div>{data.App_Acronym}</div>
            </ul>
          ))}
        <div className="row">
            <div className="column"><label>test 1</label></div>
            <div className="column"><label>test 2</label></div>
        </div>
        <Modal show={show}
        onHide={handleClose}
        backdrop={true}
        keyboard={false}>

        <Modal.Header closeButton>
          <Modal.Title>Create Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="secondary">{notif}</Alert>
        <form>
          <label>Application Name:</label><br/>
          <input onChange={e => setApp_Acronym(e.target.value)} type="text" name="appname" placeholder="Application name" id="app_acronym" required autoComplete="off" /><br/>
          <label>Description: </label><br/>
          <textarea onChange={e => setApp_Description(e.target.value)} name="description" placeholder="Description" cols="40" /><br/>
          <label>R Number: </label><br/>
          <input onChange={e => setApp_Rnumber(e.target.value)} type="number" name="rnumber" placeholder="R Number" required min={1} /><br/>
          <label>Start Date: </label><br/>
          <input onChange={e => setApp_startDate(e.target.value)} type="date" name="appstartdate" /><br/>
          <label>End Date: </label><br/>
          <input onChange={e => setApp_endDate(e.target.value)} type="date" name="appenddate" /><br/>
          <label>Permit create: </label><br/>
          {/* <input onChange={e => setApp_Permit_Create(e.target.value)} type="text" placeholder="User group" /><br/> */}
          <select onChange={e => setApp_Permit_Create(e.target.value)} name="usergroup11">
            <option> </option>
            {list1.map((option, i) => (
              <option key={i} value={option.groupname}>{option.groupname}</option>
            ))}
          </select><br/> 
          <label>Permit open: </label><br/>
          {/* <input onChange={e => setApp_Permit_Open(e.target.value)} type="text" placeholder="User group" /><br/> */}
          <select onChange={e => setApp_Permit_Open(e.target.value)} name="usergroup12">
            <option> </option>
            {list1.map((option, i) => (
              <option key={i} value={option.groupname}>{option.groupname}</option>
            ))}
          </select><br/> 
          <label>Permit toDoList: </label><br/>
          {/* <input onChange={e => setApp_Permit_toDoList(e.target.value)} type="text" placeholder="User group" /><br/> */}
          <select onChange={e => setApp_Permit_toDoList(e.target.value)} name="usergroup13">
            <option> </option>
            {list1.map((option, i) => (
              <option key={i} value={option.groupname}>{option.groupname}</option>
            ))}
          </select><br/> 
          <label>Permit doing: </label><br/>
          {/* <input onChange={e => setApp_Permit_Doing(e.target.value)} type="text" placeholder="User group" /><br/> */}
          <select onChange={e => setApp_Permit_Doing(e.target.value)} name="usergroup14">
            <option> </option>
            {list1.map((option, i) => (
              <option key={i} value={option.groupname}>{option.groupname}</option>
            ))}
          </select><br/> 
          <label>Permit done: </label><br/>
          {/* <input onChange={e => setApp_Permit_Done(e.target.value)} type="text" placeholder="User group" /><br/> */}
          <select onChange={e => setApp_Permit_Done(e.target.value)} name="usergroup15">
            <option> </option>
            {list1.map((option, i) => (
              <option key={i} value={option.groupname}>{option.groupname}</option>
            ))}
          </select><br/> 
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
        backdrop={true}
        keyboard={false}>

        <Modal.Header closeButton>
          <Modal.Title>Create Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="secondary">{notif}</Alert>
          <form>
            <label>Plan Name:</label><br/>
            <input onChange={e => setPlan_MVP_name(e.target.value)} type="text" name="planname" placeholder="Plan name" required autoComplete="off" /><br/>
            <label>Start Date: </label><br/>
            <input onChange={e => setPlan_startDate(e.target.value)} type="date" name="planstartdate" required /><br/>
            <label>End Date: </label><br/>
            <input onChange={e => setPlan_endDate(e.target.value)} type="date" name="planenddate" required /><br/>
            <label>Assign to Application:</label><br/>
            {/* <input onChange={e => setPlan_app_Acronym(e.target.value)} type="text" placeholder="Application Name" /> */}
            <select onChange={e => setPlan_app_Acronym(e.target.value)} name="usergroup21" placeholder="Select Application">
              <option> </option>
            {list2.map((option, i) => (
              <option key={i} value={option.App_Acronym}>{option.App_Acronym}</option>
            ))}
          </select><br/>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button onClick={handleCreateplan} variant="primary">Create</Button>
        </Modal.Footer>
        </Modal>

        <Modal show={show3}
        onHide={handleClose3}
        backdrop={true}
        keyboard={false}>

        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="secondary">Test alert</Alert>
          <form>
            <label>Task Name:</label><br/>
            <input onChange={e => setTask_name(e.target.value)} type="text" name="taskname" placeholder="Task name" required autoComplete="off" /><br/>
            <label>Description:</label><br/>
            <textarea onChange={e => setTask_description(e.target.value)} name="taskdescription" placeholder="Description" cols="40" /><br/>
            <label>Notes:</label><br/>
            <textarea onChange={e => setTask_notes(e.target.value)} name="tasknotes" placeholder="Notes" cols="40" /><br/>
            <label>Task ID:</label><br/>
            <input onChange={e => setTask_id(e.target.value)} type="text" placeholder="E.g. testApp_2" readOnly /><br/>
            <label>Assign to Plan:</label><br/>
            <select onChange={e => setTask_plan(e.target.value)} name="usergroup31" placeholder="Select Plan">
              <option> </option>
              {list3.map((option, i) => (
                <option key={i} value={option.Plan_MVP_name}>{option.Plan_MVP_name}</option>
              ))}
            </select><br/>
            <label>Assign to Application:</label><br/>
            <select onChange={e => setTask_app_Acronym(e.target.value)} name="usergroup32" placeholder="Select Application">
              <option> </option>
              {list2.map((option, i) => (
                <option key={i} value={option.App_Acronym}>{option.App_Acronym}</option>
              ))}
            </select><br/>
            <label>Assign state:</label><br/>
            <select onChange={e => setTask_state(e.target.value)} name="taskstate" >
              <option value="state_open">Open</option>
              <option value="state_toDoList">toDoList</option>
              <option value="state_doing">Doing</option>
              <option value="state_done">Done</option>
            </select><br/>
            <label>Task Creator:</label><br/>
            <input onChange={e => setTask_creator(e.target.value)} type="text" placeholder="Set as current user?" value={namelabel} /><br/>
            <label>Task Owner:</label><br/>
            <input onChange={e => setTask_owner(e.target.value)} type="text" placeholder="Owner" /><br/>
            <label>Task Created Date:</label><br/>
            <input onChange={e => setTask_createDate(e.target.value)} type="text" placeholder="Date" value={currentDate}/><br/>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose3}>
            Close
          </Button>
          <Button onClick={handleCreatetask} variant="primary">Create</Button>
        </Modal.Footer>

        </Modal>
      </div>
      <div className="component">
      </div>
    </>
  )
}

export default HomeUser