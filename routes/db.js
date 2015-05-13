mysql = require('mysql');
exports.pool  = mysql.createPool({
	connectionLimit : 10,
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : '*'
});

//export.pool = function(){