// Controller - Server.js
const database = require ("./src/database.js");
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');
var passwordValidator = require('password-validator');
const bcrypt = require('bcrypt');


const connection = mysql.createConnection({
	host     : database.host,
	user     : database.user,
	password : database.password,
	database : database.database
});

function validatePassword(password){
	var schema = new passwordValidator();
	schema
	.is().min(8, 'Minimum of 8 characters required')
	.is().max(10, 'Maximum of 10 characters only')
	.has().uppercase()
	.has().lowercase()
	.has().digits()
	.has().not().spaces()
	.has().symbols(0, 'Special characters required')

	return schema.validate(password, {details: true});
}
//var v = validatePassword('passw0rd');
//console.log(v);

const saltRounds = 10;

//query section
querySelectUsername = 'SELECT * FROM useraccounts WHERE username = ?';
queryUpdateA = 'UPDATE useraccounts SET active = ? WHERE username = ?';
querySelectGroupname = 'SELECT * FROM usergroups WHERE groupname = ?';
queryCheckgroup = 'SELECT * FROM usergroups WHERE groupname = ? AND username = ?';
queryDel = `DELETE FROM usergroups WHERE groupname = ? AND username = ?`
querySelectNot = "SELECT * FROM usergroups WHERE NOT username = '' ";

function splitString(str) {
	var string = str.split(",");

	return string;
}

function groupCheck(groupname, username) {
	connection.query(queryCheckgroup, [groupname, username], function(error, results, fields) {
		if (error) throw error;
		//console.log(results)
		 if (results.length > 0){
			return true;
		 	//console.log("1 here")
		 } else {
			return false;
		  	//console.log("2 here")
		 }
		//return results;
	});
}
//let g = groupCheck("admins","test");
//console.log(g);

function checkGroup(groupname, username) {
 	let admintag;
 	connection.query("SELECT * FROM usergroups WHERE groupname = ? AND username = ?", [groupname, username], function(error, results, fields) {
 		if (error) throw error;
		//console.log("r:" + results[0].groupname + "," +results[0].username)
 		if(results.length > 0) {
 			admintag = '1';
 		} else {
 			admintag = '0';
 		}
 		connection.query("UPDATE useraccounts SET admintag = ? WHERE username = ?", [admintag, username], function(error, results, fields) {
 			if (error) throw error;
 		});
 		//console.log(results);
		return results;
 	});
}

// function updateAdmin(length){
// 	if(length > 0) {
// 		admintag = '1';
// 	} else {
// 		admintag = '0';
// 	}
// 	connection.query("UPDATE useraccounts SET admintag = ? WHERE username = ?", [admintag, username], function(error, results, fields) {
// 		if (error) throw error;
// 	})
// }

//query function for change password
async function changePassword(username, password, response) {
	if (username && password) {
		// check password input exist or not
			let check = validatePassword(password);

		 	if (check == 0) {
		 		try{
		 			let hashedPassword = await bcrypt.hash(password, saltRounds);
		 			//console.log(hashedPassword);
					connection.query("UPDATE useraccounts SET password = ? WHERE username = ?", [hashedPassword, username], function(error, results, fields) {
		 				if (error) throw error;
		 				//console.log(results);
						if (results.affectedRows > 0){
				 			response.send('Password changed!');
				 		} else {
				 			response.send('Invalid user'); // no changes made
				 		}
		 			})
		 		} catch (e) {
		 			console.log(e);
		 		}
		 	} else {
		 		console.log(check);
		 		response.send('Password requirement not met!');
		 	}
	}
	else {
		response.send('Field is empty!');
	}
}

//query function for update email
function updateEmail(username, email, response) {
	if (username && email) {
		if (email.includes('.')) {
			connection.query("UPDATE useraccounts SET email = ? WHERE username = ?", [email, username], function(error, results, fields) {
				if (error) throw error;
				//console.log(results);
				if (results.affectedRows == 0){
					response.send('Invalid user');
				} else {
					response.send('Email updated!');
				}
			})
		} else {
			response.send('Invalid email format');
		}
	}
	else {
		response.send('Field(s) is empty!');
	}	
}

function allGroups(response) {
	connection.query("SELECT groupname FROM usergroups WHERE username = '' ", function(error, results, fields) {
		if (error) throw error;
		//console.log(results);
		response.send(results);
	});
}

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.use(cors())

// http://localhost:3000/
// app.get('/', function(request, response) {
// 	// Render login template
// 	response.sendFile(path.join(__dirname + '/index.html'));
// });

// app.get('/', function(request, response) {
// 	// get user group data
// 	connection.query("SELECT * FROM usergroups", function(error, results, fields) {
// 		if (error) throw error;
// 		console.log(results);
// 		response.send(results);
// 	});
// });

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	const {username, password} = request.body;

	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		//connection.query('SELECT * FROM useraccounts WHERE username = ?')
		connection.query(querySelectUsername, [username], async function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				//compare password
				let checkPass;
				//console.log(results[0].password + ", "+ password);
				try{
					checkPass = await bcrypt.compare(password, results[0].password);
				} catch (e) {
					console.log(e);
				}
				//console.log(checkPass +"|"+ results[0].active);
				// If password verified and user is active
				if(checkPass && results[0].active == "1"){
					let checkG = groupCheck("admins", username);
					//console.log(checkG);
					let data = [];
					data.push(results[0].username);
					data.push(results[0].admintag);
					//console.log(data);
					response.send(data);
					//	for(var i = 0; i < results.length; i++)
					//		console.log(results);
				} else {
					response.send("0");	
				}  //end of checkPass and active
			} else {
				response.send("0");
			}  //end of check account exist		
		});	
	} //else {
	//	response.send('Please enter Username and Password!');
	//	response.end();
	//}
});

// http://localhost:3000/home
app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

app.post('/changepassword', async function(request, response) {
	const {username, password} = request.body;

	changePassword(username, password, response);

});

app.post('/updateemail', function(request, response) {
	const {username, email} = request.body;

	updateEmail(username, email, response);
	
});

app.post('/createuser', async function(request, response) {
	let {username, password, email} = request.body;

	//console.log(`create user: ${username} || ${password} || ${email}`);
	// Ensure the input fields exists and are not empty
	if (username && password) {
		let check = validatePassword(password);
		let hashedPassword = await bcrypt.hash(password, saltRounds);
		// Execute SQL query to check username exist
		//connection.query("SELECT * FROM useraccounts WHERE username = ?")
		connection.query(querySelectUsername,[username] ,function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// for (var i=0; i < results.length; i ++)
			// {
			// 	console.log(results[i])
			// }
			//console.log(results);
			if(results.length > 0){
				response.send(`Username ${username} exists!`);
			} else {
				if (check == 0 && hashedPassword) {
					try{		
						// Insert user to database
						connection.query("INSERT INTO useraccounts (username, password, email, active, admintag) VALUES (?,?,?,?,?)",[username, hashedPassword, email, '1', '0'] ,function(error, results, fields) {
							if (error) throw error;
						})
							//connection.query('SELECT * FROM usergroups WHERE groupname = ?', [groupname], function(error, results, fields) {
							//	if (error) throw error;
							//console.log('test:' +email +','+groupname)
							//if (groupname){
							//var s = splitString(',');
							//for (var i = 0; i < s.length; i++){
							//	query = `INSERT INTO usergroups (groupname, username) VALUES (?,?)`
								//groupname = s[i];
							//	connection.query(query, [groupname, username] ,function(error, results) {
							//		if (error) throw error;
							//		console.log(results)
							//	})	
							//}
						response.send(`User ${username} created!`);
						} catch (e) {
							console.log(e);
						}
				} else {
					console.log(check);
					response.send('Password requirement not met!');
				}
			}
		}) 
	} 
	else {
		response.send('Field(s) is empty!');
	} 
});

app.post('/resetuserpassword', async function(request, response) {
	const {username, password} = request.body;

	changePassword(username, password, response);

});

app.post('/updateuseremail', function(request, response) {
	const {username, email} = request.body;

	updateEmail(username, email, response);

});

app.post('/disableuser', function(request, response) {
	const {username} = request.body;

	if (username) {
		connection.query(queryUpdateA, ["0", username], function(error, results, fields) {
			if (error) throw error;
			//console.log(results);
			if (results.affectedRows){
				response.send(`User ${username} disabled`);
			} else {
				response.send('Invalid user'); // no changes made
			}
		})
	}
	else {
		response.send('Field is empty!');
	}
});

app.post('/enableuser', function(request, response) {
	const {username} = request.body;

	if (username) {
		connection.query(queryUpdateA, ['1', username], function(error, results, fields) {
			if (error) throw error;
			//console.log(results);
			if (results.affectedRows){
				response.send(`User ${username} enabled`);
			} else {
				response.send('Invalid user'); // no changes made
			}
		})
	}
	else {
		response.send('Field is empty!');
	}
});

app.post('/createusergroup', function(request, response) {
	const {groupname} = request.body;
	
	if (groupname) {
		connection.query(querySelectGroupname, [groupname] , function(error, results, fields) {
			if (error) throw error;
			//console.log(results);
			if(results.length > 0){
				response.send(`Group ${groupname} exists!`);
			} else {
				// Insert group to database
				query = `INSERT INTO usergroups (groupname) VALUES (?)`
				connection.query(query,[groupname] ,function(error, results) {
					if (error) throw error;
					console.log("create: " + results);
				})	
				response.send(`Group ${groupname} created!`);
			}
		})	
	} else {
		response.send('Field is empty!');
	}
});

app.post('/addusertogroup', function(request, response) {
	const {groupname2, username} = request.body;
	
	if(groupname2 && username){
		connection.query(queryCheckgroup, [groupname2, username] , function(error, results, fields) {
			if (error) throw error;
			// check if record exists
			if(results.length > 0) {
				response.send('Record exists!');
			} else {
				//query2 = `SELECT * FROM useraccounts WHERE username = ?`
				connection.query(querySelectUsername,[username], function(error, results) {
					if (error) throw error;
					console.log("length: " + results);
					//check if username exists
					if (results.length > 0){
						connection.query(querySelectGroupname, [groupname2] , function(error, results, fields) {
							if (error) throw error;
							if (results.length > 0){
								query = `INSERT INTO usergroups (groupname, username) VALUES (?,?)`
								connection.query(query,[groupname2, username] ,function(error, results) {
									if (error) throw error;
								})
								response.send(`User ${username} added to Group ${groupname2}!`);
								checkGroup(username,"admins");
							} else {
								response.send(`Group ${groupname2} does not exist`);
							}
						})
					} else {
							response.send(`User ${username} does not exist`);
					}
				})
			}
		});
	} else {
		response.send('Field(s) is empty!');
	}
});

app.post('/removeuserfrgroup', function(request, response) {
	const {groupname2, username} = request.body;
	
	if(groupname2 && username){
		connection.query(queryCheckgroup, [groupname2, username],function(error, results, fields) {
			if (error) throw error;
			// check if record exists
			if(results.length > 0) {
				
				connection.query(queryDel, [groupname2, username],function(error, results) {
					if (error) throw error;
				})
				
				checkGroup(username,"admins");
				response.send(`User ${username} removed from Group ${groupname2}!`);
			} else {
				response.send('Record does not exists!');
			}
		});
	} else {
		response.send('Field(s) is empty!');
	}
});

app.post('/displayusergroup', function(request, response) {
	const {groupname3} = request.body;

	// if(groupname3){
	// 	//not in use
	// 	connection.query(querySelectGroupname, [groupname3], function(error, results, fields) {
	// 	 	if (error) throw error;
	// 	 	console.log(results);
	// 	 	response.send(results);
	// 	 });
	// } else { 
		//display all records
		connection.query(querySelectNot, function(error, results, fields) {
		  	if (error) throw error;
		  	//console.log(results);
		  	response.send(results);
	  	});
	//} 
});

app.post('/showallgroups', function(request, response) {

	allGroups(response);
	// connection.query("SELECT * FROM usergroups WHERE username = '' ", function(error, results, fields) {
	// 	if (error) throw error;
	// 	//console.log(results);
	// 	response.send(results);
	// });
});

// app.post('/showallusers', function(request, response) {
// 	connection.query("SELECT username FROM useraccounts", function(error, results, fields) {
// 		if (error) throw error;
// 		//console.log(results);
// 		response.send(results);
// 	});
// });

require("./src/TaskController")(app);

app.listen(4000);
console.log("Server running")
