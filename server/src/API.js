module.exports = app => {
  const database = require ("./database.js");
    const mysql = require('mysql');
    const nodemailer = require('nodemailer');
    const cors = require('cors');
    const bcrypt = require('bcrypt');

    const connection = mysql.createConnection({
        host     : database.host,
        user     : database.user,
        password : database.password,
        database : database.database,
        multipleStatements: true
    });

    querySelectApp = 'SELECT * FROM application WHERE App_Acronym = ?';
    querySelectTask = 'SELECT * FROM task WHERE Task_name = ?';
    queryInsertTask = 'INSERT INTO task (Task_name, Task_description, Task_notes, Task_id, Task_plan, Task_app_Acronym, Task_state, Task_creator, Task_owner, Task_createDate) VALUES (?,?,?,?,?,?,?,?,?,?)';
    queryPromoteTask = 'UPDATE task SET Task_notes = ?, Task_state = ?, Task_owner = ? WHERE Task_name = ?';

    const timestamp = new Date();

    app.post('/api/create-new-task', function(request, response) {
        //let {username, password, Task_name, App_Acronym, Task_description} = request.body;
        let dataJSON = request.body;
        //console.log(dataJSON)
        let JSON = {};
        for (let key in dataJSON) {
          JSON[key.toLowerCase()] = dataJSON[key];
        }
        //console.log(JSON)

        let username = JSON.username;
        let password = JSON.password;
        let Task_name = JSON.task_name;
        let App_Acronym = JSON.app_acronym;
        let Task_description = JSON.task_description;

        const monthTwoD = (month) => {
            return (month < 10 ? '0' : '') + month;
          }

        const dayTwoD = (day) => {
            return (day < 10 ? '0' : '') + day;
         }

        const d = new Date();
        let month =  d.getMonth();
        let day = d.getDate();
        let Task_createDate = d.getFullYear() + "-" + (monthTwoD(month + 1)) + "-" + (dayTwoD(day + 1));
        let Task_state = "Open";

        if (!JSON.hasOwnProperty("username") | !JSON.hasOwnProperty("password") | !JSON.hasOwnProperty("task_name") | !JSON.hasOwnProperty("app_acronym") | !JSON.hasOwnProperty("task_description")) {
            response.send({ code: 4008 });
        } else {

            //check login
            if(username && password){
                connection.query('SELECT * FROM useraccounts WHERE username = ?', [username], async function(error, results) {
                    if (error) throw error;
                    if (results.length > 0) {
                        //compare password
                        let checkPass;
                        try{
                            checkPass = await bcrypt.compare(password, results[0].password);
                            if (checkPass) {
                                //check inactive user
                                if (results[0].active == "1") {
                                    // check app name
                                    if(App_Acronym){
                                        connection.query(querySelectApp, [App_Acronym], function(error, results) {
                                            if (error) throw error;
                                            //check app permit, usergroup
                                            if(results.length > 0){
                                                let permitCreate = results[0].App_permit_Create;
                                                connection.query('SELECT * FROM usergroups WHERE username = ?', [username], function(error, results){
                                                    if (error) throw error;
                                                    if(results.length > 0){
                                                        let usergroup = results[0].groupname;
                                                        if(usergroup === permitCreate == true){
                                                            //check create task
                                                            if (Task_name){ 
                                                                connection.query(querySelectTask, [Task_name], function(error, results) {
                                                                    if (error) throw error;
                                                                    //check if task name exist
                                                                    if (results.length > 0) {
                                                                        response.send({code: 4003});
                                                                    } else {
                                                                        connection.query(querySelectApp, [App_Acronym], function(error, results) {
                                                                            if (error) throw error;
                                                                            //check invalid app 
                                                                            //if(results.length > 0) {
                                                                                let tempNum = (results[0].App_Rnumber + 1);
                                                                                let Task_id = App_Acronym + "_" + tempNum;
                                                                                let Task_plan = " ";
                                                                                const newNotes = `${username} created Task ${Task_name} at ${Task_state} state. [${timestamp}]`;
                                                                                connection.query(queryInsertTask, [Task_name, Task_description, newNotes, Task_id, Task_plan, App_Acronym, Task_state, username, username, Task_createDate], function(error, results) {
                                                                                    if (error) throw error;
                                                                                    //update rnumber
                                                                                    connection.query("UPDATE application SET App_Rnumber = ? WHERE App_Acronym = ?", [tempNum, App_Acronym], function(error, results) {
                                                                                        if (error) throw error;
                                                                                        //console.log(results);
                                                                                        response.send({code: 200, data: Task_id});
                                                                                    });
                                                                                });
                                                                            // } else {
                                                                            //     response.send({code: 4005});
                                                                            // }
                                                                        });
                                                                    }
                                                                });
                                                            } else {
                                                                response.send({code: 4006}); //empty task name
                                                            } 
                                                        } else {
                                                            response.send({code: 4002}) //invalid permit group
                                                        }
                                                    } else {
                                                        //user not in usergroup
                                                        response.send({code: 4005});
                                                    }
                                                })
                                            } else {
                                                //invalid app
                                                response.send({code: 4005})
                                            }
                                        });
                                    } else {
                                        //empty app
                                        response.send({code: 4006}); 
                                    }
                                } else {
                                    //inactive user
                                    response.send({code: 4002})
                                }
                            } else {
                                //invalid login pw
                                response.send({code: 4001})
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        //invalid login name
                        response.send({code: 4001})
                    }
                });
            } else {
            //empty field
            response.send({code: 4006}); 
            } 
        }         
    });

    app.get('/api/get-task-by-state', function(request, response) {
        //let {username, password, Task_state} = request.body;
        let dataJSON = request.body;
        let JSON = {};
        for (let key in dataJSON) {
          JSON[key.toLowerCase()] = dataJSON[key];
        }

        //console.log(JSON.username +":"+ JSON.password +":"+ JSON.task_state)
        let username = JSON.username;
        let password = JSON.password;
        let Task_state = JSON.task_state;

        //check invalid json value
        if (!JSON.hasOwnProperty("username") | !JSON.hasOwnProperty("password") | !JSON.hasOwnProperty("task_state")) {
            response.send({ code: 4008 });
        } else {
        
            if(username && password){
                connection.query('SELECT * FROM useraccounts WHERE username = ?', [username], async function(error, results) {
                    if (error) throw error;
                    if (results.length > 0) {    
                        //compare password
                        let checkPass;
                        try{
                            checkPass = await bcrypt.compare(password, results[0].password);
                            //console.log(checkPass)
                            if (checkPass) {
                                //console.log(results[0].active)
                                if (results[0].active == "1") {
                                    // check for empty task state
                                    if(Task_state) {
                                        const states = ['Open', 'toDoList', 'Doing', 'Done', 'Close'];  
                                        let getState;
                                        for (let i = 0; i < states.length; i++) {
                                            //console.log(states[i]);
                                            let temp = states[i];
                                            if(Task_state.toLowerCase() === temp.toLowerCase() == true){
                                                getState = temp;
                                            }
                                        }
                                        
                                        if(getState) {
                                            connection.query('SELECT * FROM task WHERE Task_state = ?', [getState], function(error, results) {
                                                if (error) throw error;
                                                response.send({code: 200, data: results}); //code 200
                                            });
                                        } else {
                                            //invalid task state;
                                            response.send({code: 4005});
                                        }
                                    } else {
                                        //empty task state
                                        response.send({code: 4006});
                                    } 
                                } else {
                                    //inactive user
                                    response.send({code: 4002})
                                }
                            } else {
                                //invalid login
                                response.send({code: 4001})
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        //invalid login
                        response.send({code: 4001})
                    }
                });        
            } else {
                //empty field
                response.send({code: 4006}); 
            }

        }

    });

  function sendEmailNotif(Task_name, sender) {
        
        var transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "e30576dc60d5cd",
              pass: "18febd43e28a55"
            }
        });

        let projleadList = [];
        let querySelectTL = "SELECT * FROM usergroups WHERE groupname = 'project lead' AND NOT username = '' ";
        connection.query(querySelectTL, function(error, results) {
            if (error) throw error;
            //console.log(results);
            projleadList.push(results[0].username);
            //console.log(projleadList);
        });

        let senderEmail, receiverEmail;
        connection.query("SELECT * FROM useraccounts WHERE username = ?", [sender], function(error, results) {
            if (error) throw error;
            senderEmail = results[0].email;
            for (let i = 0; i < projleadList.length; i++) {
                let tempName = projleadList[i];
                //console.log(tempName)
                connection.query("SELECT * FROM useraccounts WHERE username = ?", [tempName], async function(error, results) { 
                    if (error) throw error;
                    //console.log(results);
                    receiverEmail = results[0].email;
                    //console.log(senderEmail + "," + receiverEmail);

                    await transport.sendMail({
                        from: `${senderEmail}`,
                        to: `${receiverEmail}`,
                        subject: "Task notification: Done",
                        html: `<div className="email" style="
                         padding: 20px;
                         font-family: sans-serif;
                         line-height: 2;
                         font-size: 16px;
                         ">
                         <h2> Task notification </h2>
                         <p>This message is to notify that Task ${Task_name} is marked Done by ${sender}.
                         <br/>Thank you.</p>
                         </div>`
                    })
                    
                })
            }
        })    
    }

    app.post('/api/promote-task-to-done', function(request, response) {
        //let {username, password, Task_id} = request.body;
        let dataJSON = request.body;
        let JSON = {};
        for (let key in dataJSON) {
          JSON[key.toLowerCase()] = dataJSON[key];
        }
        
        let username = JSON.username;
        let password = JSON.password;
        let Task_name = JSON.task_name;

        if (!JSON.hasOwnProperty("username") | !JSON.hasOwnProperty("password") | !JSON.hasOwnProperty("task_name")) {
            response.send({ code: 4008 });
        } else {
  
            //check login
            if(username && password){
                connection.query('SELECT * FROM useraccounts WHERE username = ?', [username], async function(error, results) {
                    if (error) throw error;
                    //console.log(results)
                    if(results.length > 0) {
                        //compare password
                        let checkPass;
                        try{
                            checkPass = await bcrypt.compare(password, results[0].password);
                            //console.log(checkPass)
                            if (checkPass) {
                                //console.log(results[0].active)
                                if (results[0].active == "1") {
                                    //console.log(Task_id)
                                    
                                    if(Task_name){
                                        connection.query('SELECT * FROM task WHERE Task_name = ?', [Task_name], function(error, results) {
                                            if (error) throw error;
                                            //console.log(results[0].Task_app_Acronym + ", " + results[0].Task_state)
                                            //check task_id exists
                                            if (results.length > 0) {
                                                let Task_name = results[0].Task_name;
                                                let Task_state = results[0].Task_state;
                                                let App_Acronym = results[0].Task_app_Acronym;
                                                //check task state valid
                                                if (Task_state === "Doing"){
                                                    //check empty app
                                                    if(App_Acronym){
                                                        connection.query('SELECT * FROM application WHERE App_Acronym = ?', [App_Acronym], function(error, results) {
                                                            if (error) throw error;
                                                            let permitDoing = results[0].App_permit_Doing;
                                                            //check app exist
                                                            if(results.length > 0){
                                                                connection.query('SELECT * FROM usergroups WHERE username = ?', [username], function(error, results){
                                                                    if (error) throw error;
                                                                    //check promote task 2 done
                                                                    let usergroup = results[0].groupname;
                                                                    if(usergroup === permitDoing == true){
                                                                        
                                                                        const notesMove = `${username} moved Task ${Task_name} from 'Doing' to 'Done'. [${timestamp}]`;
                                                                        const newState = "Done";
                                                                        /* UPDATE task SET Task_notes = ?, Task_state = ?, Task_owner = ? WHERE Task_name = ? */
                                                                        connection.query(queryPromoteTask, [notesMove, newState, username, Task_name], function(error, results) {
                                                                            if (error) throw error;
                                                                            //console.log(results);
                                                                            sendEmailNotif(Task_name, username);
                                                                            response.send({code: 200})
                                                                        });
                                                                        
                                                                    } else {
                                                                        response.send({code: 4002}); //forbidden user group
                                                                    } 
                                                                });
                                                            } else {
                                                                response.send({code: 4005}) //invalid app acronym
                                                            }
                                                        });
                                                    } else {
                                                        response.send({code: 4006}) //empty app acronym
                                                    }
                                                } else {
                                                    //invalid state
                                                    response.send({code: 4007}); 
                                                }
                                            } else {
                                                //invalid task_id
                                                response.send({code: 4005})
                                            }
                                        });
                                    } else {
                                        //empty task_id
                                        response.send({code: 4006})
                                    }
                                } else {
                                    //inactive user
                                    response.send({code: 4002})
                                }
                            } else {
                                //invalid login
                                response.send({code: 4001})
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        //invalid login
                        response.send({code: 4001});
                    }
                });
            } else {
                //empty field
                response.send({code: 4006}); 
            }

        }
    });
}