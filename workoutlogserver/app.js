require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./db.js');
const User = sequelize.import(__dirname + '\/models\/user.js');
// const http = require('http').Server(app);

// app.use(express.static(__dirname + '/public'));

// app.get('/', function(reg,res){
// 	res.sendFile(__dirname + '/index.html');
// })


// User.sync();
/* THIS WILL DROP THE ENTIRE USER TABLE!!! WARNING!!!
User.sync({force: true}); */
sequelize.sync();
app.use(bodyParser.json());
app.use(require('./middleware/headers'));
app.use(require('./middleware/validate-session.js'));
app.use('/api/user', require('./routes/user.js'));
app.use('/api/login', require('./routes/session.js'));
app.use('/api/definition', require('./routes/definition.js'));
app.use('/api/log', require('./routes/log.js'))

app.use('/api/test', function(req,res){
	res.send('Hello World');
});

app.listen(3000, function(){
	console.log("Listening on port 3000");
});