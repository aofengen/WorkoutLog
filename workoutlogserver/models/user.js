//user model created using sequelize
//talks to table User
module.exports = function(sequelize, DataTypes){
	let User = sequelize.define('user', {
		username: DataTypes.STRING,
		passwordhash: DataTypes.STRING
	});
	return User;
};