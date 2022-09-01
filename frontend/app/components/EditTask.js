import React, { useEffect, useState } from "react"
import Axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Container, Row, Col } from "react-bootstrap"
import Alert from 'react-bootstrap/Alert'

function EditTask() {
  const navigate = useNavigate()
  let {taskname} = useParams()
  //console.log(taskname)

  const [planList, setPlanList] = useState([])
  const [notif, setNotif] = useState("")

  const [Task_name, setTask_name] = useState(taskname)
  const [Task_description, setTask_description] = useState("")
  const [Task_notes, setTask_notes] = useState("")
  const [Task_notesDisplay, setTask_notesDisplay] = useState("")
  const [Task_id, setTask_id] = useState("")
  const [Task_plan, setTask_plan] = useState("")
  const [Task_app_Acronym, setTask_app_Acronym] = useState("")
  const [Task_state, setTask_state] = useState("")
  const [Task_creator, setTask_creator] = useState("")
  const [Task_owner, setTask_owner] = useState("")
  const [Task_createDate, setTask_createDate] = useState("")
  const [planDisplay, setPlanDisplay] = useState("")
  const [stateDisplay, setStateDisplay] = useState("")

  async function getInfo() {
    try{
      const response = await Axios.get("http://localhost:4000/task/")
      //console.log(response.data)
      setPlanList(response.data)
    } catch (e) {
      if (e.response) {
        console.log(error.response)
      } else {
        console.log('Error', error.message)
      }
    }
  }

  async function fetchTaskInfo() {
    try {
      const response = await Axios.get(`http://localhost:4000/task/${taskname}`, {
         params: {
           task_name: taskname
         }
      })
      //console.log(response.data)
      setTask_description(response.data[0].Task_description)
      setTask_notesDisplay(response.data[0].Task_notes)
      setTask_id(response.data[0].Task_id)
      setPlanDisplay(response.data[0].Task_plan)
      setTask_app_Acronym(response.data[0].Task_app_Acronym)
      setTask_state(response.data[0].Task_state)
      setTask_creator(response.data[0].Task_creator)
      setTask_createDate(response.data[0].Task_createDate)
    } catch (e) {
      if (e.response) {
        console.log(error.response)
      } else {
        console.log('Error', error.message)
      }
    }
  }

  useEffect(() => {getInfo()}, [])
  useEffect(() => {fetchTaskInfo()}, [])

  let plans = planList.filter(function(planList) {
    return planList.Plan_app_Acronym === Task_app_Acronym;
  }); 

  const states = [
    {state: 'Open'}, 
    {state: 'toDoList'}, 
    {state: 'Doing'}, 
    {state: 'Done'}
  ];

  const [stateSelect, setStateselect] = useState(states)

  async function handleUpdateTask(e) {
    e.preventDefault()
    //console.log(Task_name +","+ Task_notes +","+ Task_plan +"," + stateDisplay +"," + Task_state +","+ Task_owner);
		try {
			const response = await Axios.post('http://localhost:4000/updatetask', {Task_name, Task_description, Task_notes, Task_notesDisplay, Task_plan, Task_state, stateDisplay, Task_owner: localStorage.getItem("sysUsername")})
      //console.log(response.data)
      setNotif(response.data)
      setTask_plan("")
      setTask_description("")
      setTask_notes("")
		} catch(e) {
			console.log("Error encountered")
		}
  }

  return (
    <>
      <div className="container container--narrow py-md-3">
      <header><h4>Edit Task</h4><br/></header>
        <Container>
          <Row>
            <Col xs lg="6">
              <Alert variant="secondary">{notif}</Alert>
            </Col>
          </Row>
          <Row xs={5}>
            <Col>
            <label>Task Name:</label><br/>
            <input type="text" name="task_name" defaultValue={Task_name} readOnly /><br/>
            </Col>
            <Col>
            <label>Plan: {planDisplay}</label><br/>
            {/* <input type="text" name="task_plan" defaultValue={Task_plan} readOnly /><br/> */}
            <select onChange={e => setTask_plan(e.target.value)} name="usergroup31" placeholder="Select Plan" defaultValue={Task_plan}>
                <option value="">--Select--</option>
                {plans.map((option, i) => (
                    <option key={i} value={option.Plan_MVP_name}>{option.Plan_MVP_name}</option>
                ))}
            </select>
            </Col>
          </Row>
        <label>Description:</label><br/>
        <textarea onChange={e => setTask_description(e.target.value)} name="task_description" placeholder="Description" rows="6" cols="80" defaultValue={Task_description} /><br/>
        <label>Notes:</label><br/>
        <textarea onChange={e => setTask_notes(e.target.value)} name="task_notes" placeholder="Notes" rows="7" cols="80" value={Task_notes} />{" "}
        <textarea name="task_notes" placeholder="Notes" rows="7" cols="70" defaultValue={Task_notesDisplay} readOnly/><br/>
          <Row xs={5}>
            {/* <Col>
            <label>Task ID:</label><br/>
            <input type="text" name="task_id" defaultValue={Task_id} readOnly /><br/>
            </Col> */}
            <Col>
            {/* <label>Plan: {planDisplay}</label><br/>
            <select onChange={e => setTask_plan(e.target.value)} name="usergroup31" placeholder="Select Plan" defaultValue={Task_plan}>
                <option value="">--Select--</option>
                {plans.map((option, i) => (
                    <option key={i} value={option.Plan_MVP_name}>{option.Plan_MVP_name}</option>
                ))}
            </select> */}
            </Col>
            <Col>
            {/* <label>State: {stateDisplay}</label><br/> */}
            {/* <input type="text" name="task_state" defaultValue={Task_state} readOnly /> */}
            {/* <select onChange={e => setTask_state(e.target.value)} name="task_state" >
                <option value=" ">--Select--</option>
                {stateSelect.map((option, i) => (
                    <option key={i} value={option.state}>{option.state}</option>
                ))}
            </select> */}
            </Col>
          </Row>
          <Row xs={5}>
            {/* <Col>
            <label>Task Creator: {Task_creator}</label><br/>
            <input type="text" name="task_creator" defaultValue={Task_creator} readOnly />
            </Col>
            <Col>
            <label>Task Owner:</label><br/>
            <input onChange={e => setTask_owner(e.target.value)} type="text" name="task_owner" placeholder="Owner name" defaultValue={Task_owner} readOnly />
            </Col>
            <Col>
            <label>Task Created Date:</label><br/>
            <input type="text" name="task_createdate" placeholder="Date"defaultValue={Task_createDate} readOnly />
            </Col> */}
          </Row>  
        </Container>
        <br/>
        <Button variant="primary" onClick={handleUpdateTask}>Save</Button>{" "}
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </div> 
    </>
  )
}

export default EditTask