module.exports = app => {
    const database = require ("./database.js");
    const mysql = require('mysql');
    const nodemailer = require('nodemailer');
    const cors = require('cors');
    const bcrypt = require('bcrypt');
    //require("dotenv").config();

    const connection = mysql.createConnection({
        host     : database.host,
        user     : database.user,
        password : database.password,
        database : database.database,
        multipleStatements: true
    });

    querySelectApp = 'SELECT * FROM application WHERE App_Acronym = ?';
    queryInsertApp = 'INSERT INTO application (App_Acronym, App_Description, App_Rnumber, App_startDate, App_endDate, App_Permit_Create, App_Permit_Open, App_Permit_toDoList, App_Permit_Doing, App_Permit_Done) VALUES (?,?,?,?,?,?,?,?,?,?)';
    querySelectPlan = 'SELECT * FROM plan WHERE Plan_MVP_name = ?';
    queryInsertPlan = 'INSERT INTO plan (Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_app_Acronym) VALUES (?,?,?,?)';
    querySelectTask = 'SELECT * FROM task WHERE Task_name = ?';
    queryInsertTask = 'INSERT INTO task (Task_name, Task_description, Task_notes, Task_id, Task_plan, Task_app_Acronym, Task_state, Task_creator, Task_owner, Task_createDate) VALUES (?,?,?,?,?,?,?,?,?,?)';
    queryUpdateApp = 'UPDATE application SET App_Description = ?, App_startDate = ?, App_endDate = ?, App_Permit_Create = ?, App_Permit_Open = ?, App_Permit_toDoList = ?, App_Permit_Doing = ?, App_Permit_Done = ? WHERE App_Acronym = ?';
    queryUpdateTask = 'UPDATE task SET Task_description = ?, Task_notes = ?, Task_plan = ?, Task_state = ?, Task_owner = ? WHERE Task_name = ?';
    queryPromoteTask = 'UPDATE task SET Task_notes = ?, Task_state = ?, Task_owner = ? WHERE Task_name = ?';

    const timestamp = new Date();

    function checkGroup(groupname, username) {
        return new Promise((resolve, reject) => {
            connection.query(queryCheckgroup, [groupname, username], function(error, results) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.length);
                }
            });
        });
    }

    // app.post('/showallusers', function(request, response) {
    //     connection.query("SELECT username FROM useraccounts", function(error, results) {
    //         if (error) throw error;
    //         //console.log(results);
    //         response.send(results);
    //     });
    // });

    app.get('/homeuser', function(request, response) {
        let arrayList = [];
        //note: same query in Server.js
        connection.query("SELECT groupname FROM usergroups WHERE username = '' ", function(error, results) {
            if (error) throw error;
            //console.log(results);
            arrayList.push(results);
            
            connection.query("SELECT App_Acronym FROM application", function(error, results) {
                if (error) throw error;
                //console.log(results);
                arrayList.push(results);
                response.send(arrayList);
            })

        });

    });

    app.get('/app', function(request, response) {
        let arrayList = [];

        //note: same query in Server.js
        connection.query(`SELECT groupname FROM usergroups WHERE username = '' ;SELECT Plan_MVP_name, Plan_app_Acronym, date_format(Plan_startDate, "%d-%m-%Y") as startdate, date_format(Plan_endDate, "%d-%m-%Y") as enddate FROM plan; SELECT Task_name, Task_notes, Task_plan, Task_app_Acronym, Task_state FROM task`, function(error, results) {
            if (error) throw error;
            //console.log(results);
            //arrayList.push(results);
            response.send(results);

            // connection.query("SELECT Plan_MVP_name, Plan_app_Acronym FROM plan", function(error, results) {
            //     if (error) throw error;
            //         //console.log(results);
            //         //response.send(results);
            //         arrayList.push(results);
            //         response.send(arrayList);
            // }); 
        });  
    });

    app.get('/app/:name', function(request, response) {
        let App_Acronym = request.query.app_acronym;
        let arrayList = [];

        //date_format(App_startDate, "%Y-%m-%d") as startdate, date_format(App_endDate, "%Y-%m-%d") as enddate
        connection.query(`SELECT *, date_format(App_startDate, "%Y-%m-%d") as startdate, date_format(App_endDate, "%Y-%m-%d") as enddate FROM application WHERE App_Acronym = ?`, [App_Acronym], function(error, results) {
            if (error) throw error;
            //console.log(results);
            //arrayList.push(results)
            response.send(results);

        });
    });

    app.post('/createapp', function(request, response) {
        let {App_Acronym, App_Description, App_Rnumber, App_startDate, App_endDate, App_Permit_Create, App_Permit_Open, App_Permit_toDoList, App_Permit_Doing, App_Permit_Done} = request.body;
        //console.log(`${App_Acronym} || ${App_Description} || ${App_Rnumber} || ${App_startDate} || ${App_endDate} || ${App_Permit_Create} || ${App_Permit_Open} || ${App_Permit_toDoList} || ${App_Permit_Doing} || ${App_Permit_Done}`);

        if(App_Acronym && App_Rnumber && App_startDate && App_endDate) {
            //query if acronym exist
            connection.query(querySelectApp, [App_Acronym], function(error, results, fields) {
                // If there is an issue with the query, output the error
                if (error) throw error;
                //if results.length > 0
                if (results.length > 0) {
                    response.send("Application exists!");
                } else {
                    connection.query(queryInsertApp,
                    [App_Acronym, App_Description, App_Rnumber, App_startDate, App_endDate, App_Permit_Create, App_Permit_Open, App_Permit_toDoList, App_Permit_Doing, App_Permit_Done] ,function(error, results, fields) {
                        if (error) throw error;
                        //console.log(results); checked affectedRows?
                    });
                    response.send(`App ${App_Acronym} created!`);
                }
            }); //end of query 1
        } else {
            response.send("Required field(s) is empty");
        }
        
    });

    app.post('/createplan', function(request, response) {
        let {Plan_MVP_name, Plan_startDate, Plan_endDate, App_Acronym} = request.body;
        //console.log(`${Plan_MVP_name} || ${Plan_startDate} || ${Plan_endDate} || ${App_Acronym}`);
        
        if (Plan_MVP_name && Plan_startDate && Plan_endDate) {
            connection.query(querySelectPlan, [Plan_MVP_name], function(error, results, fields) {
                // If there is an issue with the query, output the error
                if (error) throw error;
                if (results.length > 0) {
                    response.send("Plan exists!");
                } else {
                    connection.query(queryInsertPlan, [Plan_MVP_name, Plan_startDate, Plan_endDate, App_Acronym], function(error, results, fields) {
                        if (error) throw error;
                    });
                    response.send(`Plan ${Plan_MVP_name} created!`);
                }
            });
        } else {
            response.send("Required field(s) is empty");
        }
    });

    app.post('/createtask', function(request, response) {
        let {Task_name, Task_description, Task_notes, Task_id, Task_plan, Task_app_Acronym, Task_state, Task_creator, Task_owner, Task_createDate, App_Rnumber} = request.body;
        //console.log(`${Task_name} | ${Task_description} | ${Task_notes} | ${Task_id} | ${Task_plan} | ${Task_app_Acronym} | ${Task_state} | ${Task_creator} | ${Task_owner} | ${Task_createDate} | ${App_Rnumber}`);
        const notesCreate = `${Task_owner} created Task ${Task_name} at ${Task_state} state. [${timestamp}]`;
        let newNotes = notesCreate + '\n' + Task_notes;
   
        if (Task_name && Task_id){ //check task name, task_id not empty
            connection.query(querySelectTask, [Task_name], function(error, results, fields) {
                // If there is an issue with the query, output the error
                if (error) throw error;
                if (results.length > 0) {
                    response.send("Task exists!");
                } else {
                    connection.query(queryInsertTask, [Task_name, Task_description, newNotes, Task_id, Task_plan, Task_app_Acronym, Task_state, Task_creator, Task_owner, Task_createDate], function(error, results, fields) {
                        if (error) throw error;
                        App_Rnumber = App_Rnumber + 1; //increment rnumber
                        //console.log("rnum:" + App_Rnumber);
                        connection.query("UPDATE application SET App_Rnumber = ? WHERE App_Acronym = ?", [App_Rnumber, Task_app_Acronym], function(error, results) {
                            if (error) throw error;
                            console.log(results);
                            response.send(`Task ${Task_name} created!`); 
                        });
                    });
                }
            });
        } else {
            response.send("Required field(s) is empty"); 
        }
    });

    app.post('/updateapp', function(request, response) {
        let {App_Acronym, App_Description, App_startDate, App_endDate, App_Permit_Create, App_Permit_Open, App_Permit_toDoList, App_Permit_Doing, App_Permit_Done} = request.body;
        //console.log(`${App_Acronym} || ${App_Description} || ${App_startDate} || ${App_endDate} || ${App_Permit_Create} || ${App_Permit_Open} || ${App_Permit_toDoList} || ${App_Permit_Doing} || ${App_Permit_Done}`);

        connection.query(queryUpdateApp, [App_Description, App_startDate, App_endDate, App_Permit_Create, App_Permit_Open, App_Permit_toDoList, App_Permit_Doing, App_Permit_Done, App_Acronym], function(error, results) {
            if (error) throw error;
            //console.log(results);
            if (results.affectedRows == 0){
                response.send('No changes made');
            } else {
                response.send('App updated!');
            }
        })
    });


    app.get('/task', function(request, response) {
        connection.query("SELECT Plan_MVP_name, Plan_app_Acronym FROM plan", function(error, results) {
            if (error) throw error;
            response.send(results);
        })
    })

    app.get('/task/:taskname', function(request, response) {
        let Task_name = request.query.task_name;
        let arrayList = [];
        //querySelectTask = 'SELECT * FROM task WHERE Task_name = ?';
        connection.query(querySelectTask, [Task_name], function(error, results) {
            if (error) throw error;
            //console.log("test:" + results[0].Task_app_Acronym)
            response.send(results);
        })
    })

    app.post('/viewtask', function(request, response) {
        let {Task_name} = request.body;
        //console.log(Task_name);
        
        connection.query(querySelectTask, [Task_name], function(error, results) {
            if (error) throw error;
            response.send(results);
        })
    });

    app.post('/updatetask', function(request, response) {
        let {Task_name, Task_description, Task_notes, Task_notesDisplay, Task_plan, Task_state, stateDisplay, Task_owner} = request.body;
        console.log(`${Task_name} || ${Task_plan} || ${stateDisplay} || ${Task_state} || ${Task_owner}`);

        const notesUpdate1 = `${Task_owner} updated Task ${Task_name} from ${stateDisplay} to ${Task_state} and Plan ${Task_plan}. [${timestamp}]`;
        const notesUpdate2 = `${Task_owner} updated Task ${Task_name} with Plan: ${Task_plan} at State: ${Task_state}. [${timestamp}]`;
        let updatedNotes = Task_notes + '|' + notesUpdate2 + '\n' + Task_notesDisplay;

        if (Task_plan) { //if there is plan update
            connection.query("UPDATE task SET Task_description = ?, Task_notes = ?, Task_plan = ?, Task_owner = ? WHERE Task_name = ?", [Task_description, updatedNotes, Task_plan, Task_owner, Task_name], function(error, results) {
                if (error) throw error;
                //console.log(results);
                // if (results.affectedRows == 0){
                //     response.send('No changes made');
                // } else {
                    response.send('Task updated!');
                //}
            })
        } else { //if does not match above conditions
            connection.query(queryUpdateTask, [Task_description, updatedNotes, Task_plan, Task_state, Task_owner, Task_name], function(error, results) {
                if (error) throw error;
                response.send('Task updated!');
            })
        }
    });

    app.post('/promotetodo', function(request, response) {
        let {Task_name, Task_notes, Task_state, newState, Task_owner} = request.body;
        //console.log(`${Task_name} | ${Task_notes} | ${Task_state} | ${newState} | ${timestamp}`);

        const notesMove = `${Task_owner} moved Task ${Task_name} from '${Task_state}' to '${newState}'. [${timestamp}]`;
        let updatedNotes = notesMove + '\n' + Task_notes;

        connection.query("UPDATE task SET Task_notes = ?, Task_state = ?, Task_owner = ? WHERE Task_name = ?", 
        [updatedNotes, newState, Task_owner, Task_name], function(error, results) {
            if (error) throw error;
            //console.log(results);
            if (results.affectedRows == 0){
                response.send('No changes made');
            } else {
                response.send('Task move to ToDo');
            }
        });
    });

    app.post('/promotedoing', function(request, response) {
        let {Task_name, Task_notes, Task_state, newState, Task_owner} = request.body;
        //console.log(`${Task_name} | ${Task_notes} | ${Task_state} | ${newState} | ${timestamp}`);

        const notesMove = `${Task_owner} moved Task ${Task_name} from '${Task_state}' to '${newState}'. [${timestamp}]`;
        let updatedNotes = notesMove + '\n' + Task_notes;

        connection.query("UPDATE task SET Task_notes = ?, Task_state = ?, Task_owner = ? WHERE Task_name = ?", 
        [updatedNotes, newState, Task_owner, Task_name], function(error, results) {
            if (error) throw error;
            //console.log(results);
            if (results.affectedRows == 0){
                response.send('No changes made');
            } else {
                response.send('Task move to Doing');
            }
        });
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

        transport.verify(function(error, success) {
            if (error) {
                 console.log(error);
            } else {
                 console.log('Server is ready to take our messages');
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
                             <p>This message is to notify that Task ${Task_name} is marked Done by ${username}.
                             <br/>Thank you.</p>
                             </div>`
                        })
                    })
                }
            })

    }

    app.post('/promotedone', function(request, response) {
        let {Task_name, Task_notes, Task_state, newState, Task_owner} = request.body;
        //console.log(`${Task_name} | ${Task_notes} | ${Task_state} | ${newState} | ${timestamp}`);
        let arrayList = [];

        const notesMove = `${Task_owner} moved Task ${Task_name} from '${Task_state}' to '${newState}'. [${timestamp}]`;
        let updatedNotes = notesMove + '\n' + Task_notes;

        connection.query("UPDATE task SET Task_notes = ?, Task_state = ?, Task_owner = ? WHERE Task_name = ?", 
        [updatedNotes, newState, Task_owner, Task_name], function(error, results) {
            if (error) throw error;
            //console.log(results);
            if (results.affectedRows == 0){
                response.send('No changes made');
            } else {
                // connection.query("SELECT Task_creator FROM task WHERE Task_name = ?", [Task_name], function(error, results) {
                //     if (error) throw error;
                //     //console.log(results);
                //     //arrayList.push('Task move to Done');
                //     //arrayList.push(results);
                //     response.send(results);
                // })
                sendEmailNotif(Task_name, Task_owner);
                response.send("Email sent");
            }
        });
    });

    app.post('/promoteclose', function(request, response) {
        let {Task_name, Task_notes, Task_state, newState, Task_owner} = request.body;
        //console.log(`${Task_name} | ${Task_notes} | ${Task_state} | ${newState} | ${timestamp}`);

        const notesMove = `${Task_owner} moved Task ${Task_name} from '${Task_state}' to '${newState}'. [${timestamp}]`;
        let updatedNotes = notesMove + '\n' + Task_notes;

        connection.query("UPDATE task SET Task_notes = ?, Task_state = ?, Task_owner = ? WHERE Task_name = ?", 
        [updatedNotes, newState, Task_owner, Task_name], function(error, results) {
            if (error) throw error;
            //console.log(results);
            if (results.affectedRows == 0){
                response.send('No changes made');
            } else {
                response.send('Task move to Close');
            }
        });
    });

    app.post('/sendemail', cors(), async function(request, response) {
        let {Task_name, sender} = request.body;
        console.log(`${Task_name} || ${sender}`);

        var transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "e30576dc60d5cd",
              pass: "18febd43e28a55"
            }
        });

        transport.verify(function(error, success) {
            if (error) {
                 console.log(error);
            } else {
                 console.log('Server is ready to take our messages');
            }
         });

        //let check = await checkGroup("project lead", receiver);
        //console.log(check)
        let projleadList = [];
        let querySelectTL = "SELECT * FROM usergroups WHERE groupname = 'project lead' AND NOT username = '' ";
        connection.query(querySelectTL, function(error, results) {
            if (error) throw error;
            //console.log(results);
            projleadList.push(results[0].username);
            //console.log(projleadList);
        });

        if (sender) {
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
                        console.log(senderEmail + "," + receiverEmail);

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
                        response.send("Email sent");
                    })
                }
            })
        } else {
            response.send("Invalid sender");
        }
    });

}