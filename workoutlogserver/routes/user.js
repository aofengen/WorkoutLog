const router = require('express').Router();
const sequelize = require('../db.js');
const User = sequelize.import('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/', function(req, res){
	let username = req.body.user.username;
	let pass = req.body.user.password;
	//need to create a user object and use sequelize to put that user into our database.
	User.create({
		username: username,
		passwordhash: bcrypt.hashSync(pass, 10)
	}).then(
		//Sequelize is going to return the object it created from db.
		function createSuccess(user){
			let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
			res.json({
				user: user,
				message: 'create',
				sessionToken: token 
			});
		},
		function createError(err){
			res.send(500, err.message);
		}
	);
});

module.exports = router;