import React, { useState } from 'react'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'

function UserGroup() {
    const [groupname, setGroupname] = useState("")
    const [groupname2, setGroupname2] = useState("")
    const [groupname3, setGroupname3] = useState("")
    const [username, setUsername] = useState("")
    const [notif, setNotif] = useState("")
    const [notif2, setNotif2] = useState("")
    const [notif3, setNotif3] = useState("")
    const [list, setList] = useState([])
    const [list2, setList2] = useState([])
    const navigate = useNavigate()
    //var temp;

    //  const users = [
    //    {group: 'testgroup', username: 'test1'},
    //    {group: 'apple', username: 'user2'}, 
    //    {group: 'apple', username: 'dev3'},
    //    {group: 'italian', username: 'debug4'} ];

    //  const listUsers = users.map(data => 
    //      <table>
    //        <tr key={data.group}>
    //          <td><strong>{data.group}</strong></td>
    //          <td>{data.username}</td>
    //        </tr>
    //      </table>
    //  );

    async function handleCreate(e) {
      e.preventDefault()
      try {
        const response = await Axios.post('http://localhost:4000/createusergroup', {groupname})
          //console.log(response.data)
          setNotif(response.data)
          setGroupname(e.target.reset())
      } catch(e) {
          console.log("Error encountered")
      }
	  }

    async function handleAdd(e) {
      e.preventDefault()
      try {
        const response = await Axios.post('http://localhost:4000/addusertogroup', {groupname2, username})
          //console.log(response.data)
          setNotif2(response.data)
      } catch(e) {
          console.log("Error encountered")
      }
    }

    async function handleRemove(e) {
      e.preventDefault()
      try {
        const response = await Axios.post('http://localhost:4000/removeuserfrgroup', {groupname2, username})
          //console.log(response.data)
          setNotif2(response.data)
      } catch(e) {
          console.log("Error encountered")
      }
    }

    async function handleDisplay(e) {
      e.preventDefault()
      //setGroupname3(e.target.reset())
      setNotif3("")
      while (list2.length > 0) {
        list2.pop()
      }
         try {
            const response = await Axios.post('http://localhost:4000/displayusergroup', {groupname3})
            //console.log(response.data)
            if (response.data != 0) {
                setList(response.data)
                setNotif3("Group - User")
            } else {
                setNotif3("Invalid group")
            }
         } catch(e) {
             console.log("Error encountered")
         }
    }

    async function handleGroups(e) {
      e.preventDefault()
      setNotif3(" ")
      while (list.length > 0) {
        list.pop()
      }
      try {
        const response = await Axios.post('http://localhost:4000/showallgroups')
          //console.log(response.data)
          setList2(response.data)
          setNotif3("Existing Groups:")
          //while (list2.length > 0) {
          //  list2.pop()
          //}
      } catch(e) {
          console.log("Error encountered")
      }
    }

    async function handleUsers(e) {
      e.preventDefault()
      setNotif3(" ")
      while (list.length > 0) {
        list.pop()
      }
      try {
        const response = await Axios.post('http://localhost:4000/showallusers')
          //console.log(response.data)
          setList2(response.data)
          setNotif3("Existing Users:")
          //while (list2.length > 0) {
          //  list2.pop()
          //}
      } catch(e) {
          console.log("Error encountered")
      }
    }

    return (
        <div className="container container--narrow py-md-3">
          <button onClick={() => navigate(-1)} type="submit">Back</button>
          <h4>Create User Group</h4>
          <form onSubmit={handleCreate}>
            <label htmlFor="groupname" className="text-muted mb-1"> </label>
            <input onChange={e => setGroupname(e.target.value)} type="text" name="groupname" placeholder="Enter New Group name" />
            <button type="submit">Submit</button>
            {/* <button type="reset">Clear</button> */}
            <p><strong>{notif}</strong></p><br/>
          </form>
          <h4>Edit Users in Group</h4>
          <form>
            {/* <label htmlFor="groupname" className="text-muted mb-1">Enter Group Name: </label> */}
            <input onChange={e => setGroupname2(e.target.value)} type="text" name="checkgroup" placeholder="Enter Group name" />
            {/* <label htmlFor="username" className="text-muted mb-1">Enter Username: </label> */}
            <input onChange={e => setUsername(e.target.value)} type="text" name="username" placeholder="Enter Username" /><br/>
            <button onClick={handleAdd} type="submit">Add user to group</button>
            <button onClick={handleRemove} type="submit">Remove user from group</button>
            <button type="reset">Clear</button>
            <p><strong>{notif2}</strong></p><br/>
          </form>
          {/* <h3>Display Users by Group</h3> */}
          <form onSubmit={handleDisplay}>
            {/* <label htmlFor="searchgroup" className="text-muted mb-1">Enter Group Name: </label> */}
            {/* <input onChange={e => setGroupname3(e.target.value)} type="text" name="checkgroup" placeholder="Enter valid group name" /> */}
            <button type="submit">Show groups with user</button>
            <button onClick={handleGroups} type="submit">Show existing groups</button>
            <button onClick={handleUsers} type="submit">Show existing users</button>
            {/* <button type="reset">Clear</button> */}
          </form>
          {/* <div style={{padding: "10px 10px", textAlign: "left"}}> */}
          <ul><strong><big>{notif3}</big></strong></ul>
          {list.map((data,i) => (
            <ul key={i}>
              <div>{data.groupname} - {data.username}</div>
            </ul>
          ))}
          {list2.map((data,i) => (
            <ul key={i}>
              <div>{data.groupname}</div>
            </ul>
          ))}
          {list2.map((data,i) => (
            <ul key={i}>
              <div>{data.username}</div>
            </ul>
          ))}
          {/* <select id="cars" name="cars" size="8" multiple>
          <option value="volvo">Volvo</option>
          <option value="toyota">Toyota</option>
          <option value="fiat">Fiat</option>
          <option value="audi">Audi</option>
        </select><br/> */}
          {/* </div> */}
        </div>
      )
}

export default UserGroup