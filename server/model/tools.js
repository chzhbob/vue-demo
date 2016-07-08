var mysql = require('mysql');
var config = require("../config");

exports.getAll = function(callback) {
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT t.*,tc.`id` AS cid,tc.`icon` AS cicon, tc.`name` AS cname FROM tools t LEFT JOIN tool_categories tc ON t.`category_id` = tc.`id` WHERE t.status = 0', function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};


exports.getAttribute = function(id, callback) {
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT * FROM tool_attributes bta WHERE bta.`tool_id` = ' + parseInt(id, 10), function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.getAttributeDetail = function(id, callback) {
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT * FROM tools WHERE `id` = ' + parseInt(id, 10), function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.getAllAsObject = function(callback) {
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT * FROM tools', function(err, rows, fields){
	if (err) throw err;
		connection.end();

		var result = {};
		for(var i in rows){
			result[rows[i].id] = rows[i];
		}
		callback(result);
	});
};

exports.getEvent = function(id, callback) {
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT * FROM tool_events t WHERE t.`tool_id` = ' + parseInt(id, 10), function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.getAuthByIds = function(ids, callback) {
	var idStr = '';
	for(var i in ids){
		idStr += parseInt(ids[i], 10) + ',';
	}
	idStr = idStr.substr(0, idStr.length - 1);
	if(idStr == ''){
		callback([]);
		return;
	}

	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT * FROM tools WHERE id in ('+idStr+')', function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
}