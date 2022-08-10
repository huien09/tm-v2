module.exports = app => {
    const database = require ("./database.js");
    const mysql = require('mysql');

    const connection = mysql.createConnection({
        host     : database.host,
        user     : database.user,
        password : database.password,
        database : database.database
    });

    querySelectApp = 'SELECT * FROM application WHERE App_Acronym = ?';
    queryInsertApp = 'INSERT INTO application (App_Acronym, App_Description, App_Rnumber, App_startDate, App_endDate, App_Permit_Create, App_Permit_Open, App_Permit_toDoList, App_Permit_Doing, App_Permit_Done) VALUES (?,?,?,?,?,?,?,?,?,?)';
    querySelectPlan = 'SELECT * FROM plan WHERE Plan_MVP_name = ?';
    queryInsertPlan = 'INSERT INTO plan (Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_app_Acronym) VALUES (?,?,?,?)';
    querySelectTask = 'SELECT * FROM task WHERE Task_name = ?';
    queryInsertTask = 'INSERT INTO task (Task_name, Task_description, Task_notes, Task_id, Task_plan, Task_app_Acronym, Task_state, Task_creator, Task_owner, Task_createDate) VALUES (?,?,?,?,?,?,?,?,?,?)';

    app.post('/showallusers', function(request, response) {
        connection.query("SELECT username FROM useraccounts", function(error, results, fields) {
            if (error) throw error;
            //console.log(results);
            response.send(results);
        });
    });

    app.get('/homeuser', function(request, response) {
        let arrayList = [], list1 = [];
        //note: same query in Server.js
        connection.query("SELECT groupname FROM usergroups WHERE username = '' ", function(error, results) {
            if (error) throw error;
            //console.log(results);
            //assign results to list
            //list1 = results;
            arrayList.push(results);
            
            connection.query("SELECT App_Acronym FROM application", function(error, results) {
                if (error) throw error;
                //console.log(results);
                arrayList.push(results);
                //console.log(arrayList);

                connection.query("SELECT Plan_MVP_name FROM plan", function(error, results) {
                    if (error) throw error;
                    //console.log(results);
                    arrayList.push(results);
                    //console.log(arrayList);
                    response.send(arrayList);
                })
            })
            //response.send(results);
        });

    });

    app.post('/createapp', function(request, response) {
        let {App_Acronym, App_Description, App_Rnumber, App_startDate, App_endDate, App_Permit_Create, App_Permit_Open, App_Permit_toDoList, App_Permit_Doing, App_Permit_Done} = request.body;
        console.log(`${App_Acronym} || ${App_Description} || ${App_Rnumber} || ${App_startDate} || ${App_endDate} || ${App_Permit_Create} || ${App_Permit_Open} || ${App_Permit_toDoList} || ${App_Permit_Doing} || ${App_Permit_Done}`);

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
        let {Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_app_Acronym} = request.body;
        console.log(`${Plan_MVP_name} || ${Plan_startDate} || ${Plan_endDate} || ${Plan_app_Acronym}`);
        
        if (Plan_MVP_name && Plan_startDate && Plan_endDate) {
            //response.send("Create plan check")
            connection.query(querySelectPlan, [Plan_MVP_name], function(error, results, fields) {
                // If there is an issue with the query, output the error
                if (error) throw error;
                if (results.length > 0) {
                    response.send("Plan exists!");
                } else {
                    connection.query(queryInsertPlan, [Plan_MVP_name, Plan_startDate, Plan_endDate, Plan_app_Acronym], function(error, results, fields) {
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
        let {Task_name, Task_description, Task_notes, Task_id, Task_plan, Task_app_Acronym, Task_state, Task_creator, Task_owner, Task_createDate} = request.body;
        console.log(`${Task_name}, ${Task_description}, ${Task_notes}, ${Task_id}, ${Task_plan}, ${Task_app_Acronym}, ${Task_state}, ${Task_creator}, ${Task_owner}, ${Task_createDate}`);
    
        if (Task_name){
            connection.query(querySelectTask, [Task_name], function(error, results, fields) {
                // If there is an issue with the query, output the error
                if (error) throw error;
                if (results.length > 0) {
                    response.send("Task exists!");
                } else {
                    connection.query(queryInsertTask, [Task_name, Task_description, Task_notes, Task_id, Task_plan, Task_app_Acronym, Task_state, Task_creator, Task_owner, Task_createDate], function(error, results, fields) {
                        if (error) throw error;
                    });
                    response.send(`Task ${Task_name} created!`);
                }
            });
        } else {
            response.send("Required field(s) is empty"); 
        }
    });

}