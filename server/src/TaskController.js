module.exports = app => {
    const database = require ("./database.js");
    const mysql = require('mysql');

    const connection = mysql.createConnection({
        host     : database.host,
        user     : database.user,
        password : database.password,
        database : database.database
    });

    app.post('/showallusers', function(request, response) {
        connection.query("SELECT username FROM useraccounts", function(error, results, fields) {
            if (error) throw error;
            //console.log(results);
            response.send(results);
        });
    });

    app.get('/homeuser', function(request, response) {
        connection.query("SELECT groupname FROM usergroups WHERE username = '' ", function(error, results, fields) {
            if (error) throw error;
            console.log(results);
            response.send(results);
        });
        //response.send("sending response!")
    });

    app.post('/createapp', function(request, response) {
        let {App_Acronym, App_Description, App_Rnumber, App_startDate, App_endDate} = request.body;
        console.log(`${App_Acronym} || ${App_Description} || ${App_Rnumber} || ${App_startDate} || ${App_endDate}`);

        if(App_Acronym){
            //query if acronym exist
            //if results.length > 0
            //return alert else update table
            //connection.query({})
            response.send(`App ${App_Acronym} created!`);
        } else {
            let strMsg = "Application name field is empty";
            response.send(strMsg);
        }
        
    });
}