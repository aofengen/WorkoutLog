const router = require('express').Router();
const sequelize = require('../db.js');
const User = sequelize.import('../models/user.js');
const Definition = sequelize.import('../models/definition.js');

router.post('/', function(req, res) {
	//variables
	let description = req.body.definition.desc;
	let logType = req.body.definition.type;
	let owner = req.user.id;

	//methods
	Definition
	//objects must match the midel
		.create({
			description: description,
			logType: logType,
			owner: owner
		}).then(
			function createSuccess(definition) {
				//send a response as json
				res.join({
					definition: definition
				});
			},
			function createError(err) {
				res.send(500, err.message);
			}
		);
});

router.get('/', function(req,res) {
	let userid = req.user.id;

Definition
.findAll({
	where: {owner: userid}
	})

	.then(
		function findAllSuccess(data){
			//console.log(data);
			res.json(data);
		},
		function findAllError(err){
			res.send(500, err.message);
		}
	);
});

module.exports = router;