const express = require('express');
const app = express();
// const http = require('http').Server(app);

// app.use(express.static(__dirname + '/public'));

// app.get('/', function(reg,res){
// 	res.sendFile(__dirname + '/index.html');
// })
app.use(require('./middleware/headers'));

app.use('/api/test', function(req,res){
	res.send('Hello World');
})

app.listen(3000, function(){
	console.log("Listening on port 3000");
})