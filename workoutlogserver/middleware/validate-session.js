const jwt = require('jsonwebtoken'); //import jsonwebtoken library (encryption method)
const sequelize = require('../db.js');
const User = sequelize.import('../models/user.js');

module.exports = function(req, res, next) {
	let sessionToken = req.headers.authorization; //encrypted username and passwordhash is
												  //imported from the login page
	if(!req.body.user && sessionToken) { //if no user signed in AND session token is present
		jwt.verify(sessionToken, process.env.JWT_SECRET, function(err, decoded){ 
		//session token is decoded using the decryption key in the .env (hidden) file; 
			if(decoded) { //if successfully decrypted:
				User.findOne({where:{id:decoded.id}}).then( 
				//the decrypted username and passwordhash are checked against the database 
				//attempting to find a match
					function(user){
						//if match found, user is set (signed in) and passed to the next page
						req.user = user;
						next();
					},
					function(){
						//if no match found (incorrect username or passwordhash), error is thrown
						res.status(401).send({error: "Not authorized"});
					}
				);
			} else { //if decryption is unsuccessful, error is thrown
				res.status(401).send({error: "Not authorized"});
			}
		})
	} else { //user is signed in OR session token not present
		next(); //go to next page
	}
}