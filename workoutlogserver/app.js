const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./db.js');
const User = sequelize.import('./models/user.js');

User.sync();
/* THIS WILL DROP THE ENTIRE USER TABLE!!! WARNING!!!
 User.sync({force: true}); */
app.use(bodyParser.json());

// const http = require('http').Server(app);

// app.use(express.static(__dirname + '/public'));

// app.get('/', function(reg,res){
// 	res.sendFile(__dirname + '/index.html');
// })

app.use(require('./middleware/headers'));

app.use('/api/test', function(req,res){
	res.send('Hello World');
});

app.listen(3000, function(){
	console.log("Listening on port 3000");
});

app.post('/api/user', function(req, res){
	let username = req.body.user.username;
	let pass = req.body.user.password;
	//need to create a user object and use sequelize to put that user into
	//our database.
	User.create({
		username: username,
		passwordhash: ""
	}).then(
		//Sequelize is going to return the object it created from db.
		function createSuccess(user){
			res.json({
				user: user,
				message: 'create'
			});
		},
		function createError(err){
			res.send(500, err.message);
		}
	);
});
