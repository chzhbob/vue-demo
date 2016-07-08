var mysql = require('mysql');
var moment = require("moment");
var config = require("../config");


exports.getResourceById = function(cookiesName, id, callback) {
	var cookiesName = cookiesName ? cookiesName : '';

	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT * FROM resources r WHERE r.id =' + parseInt(id, 10)  + ' AND r.created_by = ' + connection.escape(cookiesName) + ' AND r.status = 1', function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.createResource = function(serviceNo, serviceName, copyright, mpappid, cookiesName, callback) {
	var serviceNo = serviceNo ? serviceNo : '';
	var serviceName = serviceName ? serviceName : '';
	var cookiesName = cookiesName ? cookiesName : '';
	var mpappid = mpappid ? mpappid : '';

	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query("INSERT INTO `resources`(`name`,`serviceNo`,`copyright`,`mpappid`,`status`,`created_at`,`modified_at`,`created_by`,`modified_by`) VALUES ("+connection.escape(serviceName)+","+connection.escape(serviceNo)+","+connection.escape(copyright)+","+connection.escape(mpappid)+ ",'" + '1' + "',NOW(),NOW(),"+connection.escape(cookiesName)+" ,"+connection.escape(cookiesName)+");", function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.getResourcesByCreatedBy = function(createdBy ,callback) {

	if(!createdBy){
		createdBy = '';
	}

	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query("SELECT * FROM `resources` WHERE status=1 AND created_by = " + connection.escape(createdBy) + " ORDER BY modified_at DESC ", function(err, rows, fields){
	if (err) throw err;
		connection.end();
		for(var i in rows){
			rows[i]['created_at'] = moment(rows[i]['created_at']).format('YYYY-MM-DD HH:mm:SS');
			rows[i]['modified_at'] = moment(rows[i]['modified_at']).format('YYYY-MM-DD HH:mm:SS');
		}
		callback(rows);
	});
};

exports.del = function(id, callback) {
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('UPDATE `resources` SET status=0 WHERE id = ' + parseInt(id,10), function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.updateModified = function(elemect_id, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('UPDATE `resources` r LEFT JOIN `resource_pages` rp ON r.id = rp.`resource_id` LEFT JOIN `resource_page_elements` rpe ON rpe.`resource_page_id` = rp.`id` SET r.modified_at = NOW()  WHERE rpe.`id` = ' + parseInt(elemect_id,10), function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
}