var mysql = require('mysql');
var config = require("../config");

exports.getExportsByTids = function(tids, callback) {

	var tidArgs = tids.split(',');
	if(tidArgs.length == 0){
		callback([]);
	}

	var tidStr = "";
	for(var i in tidArgs){
		tidStr += parseInt(tidArgs[i], 10) + ',';
	}
	tidStr = tidStr.substr(0, tidStr.length - 1);

	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT * FROM tool_exports WHERE tool_id IN ('+tidStr+')', function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};