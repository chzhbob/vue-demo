var mysql = require('mysql');
var config = require("../config");

exports.getPageElementByRid = function(rid, callback) {
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT rp.name as name, rpe.dom as dom, rpe.resource_page_id as page_id, rp.order as `order` FROM resource_page_elements rpe LEFT JOIN resource_pages rp ON rpe.resource_page_id = rp.id WHERE rp.resource_id = ' + parseInt(rid, 10), function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.getAllElementByPid = function(pid, callback) {
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT * FROM resource_page_elements WHERE resource_page_id = ' + parseInt(pid, 10), function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.getAllElementByRid = function(rid, callback) {
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT rpe.* FROM `resource_page_elements` rpe LEFT JOIN `resource_pages` rp ON rpe.`resource_page_id` = rp.`id` WHERE rp.`resource_id` = ' + parseInt(rid, 10), function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.delElemetById = function(id, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('DELETE FROM resource_page_elements WHERE id = ' + parseInt(id, 10), function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.getAllPagesByRid = function(rid, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT p.*,pe.dom FROM resource_pages p LEFT JOIN resource_page_elements pe ON pe.resource_page_id = p.id WHERE pe.type = 0 AND p.resource_id =' + parseInt(rid, 10) + ' ORDER BY `order` ASC', function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.getPageById = function(id, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT * FROM resource_page_elements WHERE resource_page_id = ' + parseInt(id, 10) + ' ORDER BY `order` ASC', function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.savePage = function(id, name, desc, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('UPDATE resource_pages SET `desc` = '+connection.escape(desc)+',`name`= '+connection.escape(name)+' WHERE id = ' + parseInt(id,10) , function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.newPage = function(rid, callback){
	getLatestPageOrder(rid, function(order){
		if(order == 0){
			order = "";
			orderInt = 1;
		}else{
			order = parseInt(order, 10) + 1;
			orderInt = order;
		}

		var connection = mysql.createConnection(config.mysqlConfig);
		connection.connect();
		connection.query("INSERT resource_pages(`resource_id`, `desc`, `name`, `order`) VALUES('"+parseInt(rid, 10)+"','页面"+order+"','index"+order+".html','"+orderInt+"');", function(err, row, fields){
		if (err) throw err;
			connection.query("INSERT resource_page_elements(`resource_page_id`, `dom`) VALUES('"+row.insertId+"','');", function(err, rows, fields){
				if (err) throw err;
				connection.end();
				callback(row.insertId);
			});
		});
	});
};

var getLatestPageOrder = function(rid, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query("SELECT `order` FROM `resource_pages` WHERE resource_id = " + rid + " ORDER BY `order` DESC LIMIT 1;", function(err, rows, fields){
		if (err) throw err;
		connection.end();
		if(rows.length > 0){
			callback(rows[0].order);	
		}else{
			callback(0);
		}
		
	});
};

exports.delPage = function(id, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('DELETE FROM resource_pages WHERE id = ' + parseInt(id,10), function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.getElementById = function(id, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT * FROM resource_page_elements WHERE id = ' + parseInt(id, 10) + ' ORDER BY `order` ASC', function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.newElement = function(pid, callback){
	getLatestElementOrder(pid, function(order){
		if(order == 0){
			order = "";
			orderInt = 1;
		}else{
			order = parseInt(order, 10) + 1;
			orderInt = order;
		}

		var connection = mysql.createConnection(config.mysqlConfig);
		connection.connect();
		connection.query("INSERT resource_page_elements(`resource_page_id`, `desc`, `name`,`type`,`order`) VALUES('"+parseInt(pid, 10)+"','浮层"+ order +"','dialog"+ order +"','1','"+ orderInt +"');", function(err, rows, fields){
		if (err) throw err;
			connection.end();
			callback(rows);
		});
	});
}

exports.saveElement = function(id, name, desc, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('UPDATE resource_page_elements SET `desc` = '+connection.escape(desc)+',`name`= '+connection.escape(name)+' WHERE id = ' + parseInt(id, 10), function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.saveElementDom = function(id, dom, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('UPDATE resource_page_elements SET dom='+connection.escape(dom)+' WHERE id = ' + parseInt(id, 10), function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.orderChange = function(id, order, callback){
	// 查出当前页
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.query("SELECT * FROM `resource_pages` WHERE id = " + connection.escape(id), function(err, rows, fields){
		if(err) throw err;
		if(!rows || rows.length <= 0){
			throw err;
		}

		var rid = rows[0].resource_id;
		var curOrder = rows[0].order;
		if(order == -1){
			// 上移一页
			//查出当前页的上一页，不存在则返回，存在则调换order
			connection.query("SELECT * FROM `resource_pages` WHERE `resource_id` = "+ connection.escape(rid) +" AND `order` < " + connection.escape(curOrder) + ' ORDER BY `order` DESC LIMIT 1', function(err, rows, fields){
				if(err) throw err;
				if(!rows || rows.length <= 0){
					callback({code: 0});
				}else{
					var nid = rows[0].id;
					var or = rows[0].order;
					connection.query("UPDATE `resource_pages` SET `order` = "+connection.escape(curOrder)+" WHERE `id` = "+ connection.escape(nid) , function(err, rows, fields){
						if(err) throw err;
						connection.query("UPDATE `resource_pages` SET `order` = "+connection.escape(or)+" WHERE `id` = "+ connection.escape(id) , function(err, rows, fields){
							if(err) throw err;
							callback({code: 0});
						});
					});
				}
			});
		}else{
			// 下移一页
			//查出当前页的下一页，不存在则返回，存在则调换order
			connection.query("SELECT * FROM `resource_pages` WHERE `resource_id` = "+ connection.escape(rid) +" AND `order` > " + connection.escape(curOrder) + ' ORDER BY `order` ASC LIMIT 1', function(err, rows, fields){
				if(err) throw err;
				if(!rows || rows.length <= 0){
					callback({code: 0});
				}else{
					var nid = rows[0].id;
					var or = rows[0].order;
					connection.query("UPDATE `resource_pages` SET `order` = "+connection.escape(curOrder)+" WHERE `id` = "+ connection.escape(nid) , function(err, rows, fields){
						if(err) throw err;
						connection.query("UPDATE `resource_pages` SET `order` = "+connection.escape(or)+" WHERE `id` = "+ connection.escape(id) , function(err, rows, fields){
							if(err) throw err;
							callback({code: 0});
						});
					});
				}
			});
		}
	});
		
};

var getLatestElementOrder = function(pid, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query("SELECT `order` FROM `resource_page_elements` WHERE resource_page_id = " + pid + " ORDER BY `order` DESC LIMIT 1;", function(err, rows, fields){
		if (err) throw err;
		connection.end();
		if(rows.length > 0){
			callback(rows[0].order);	
		}else{
			callback(0);
		}
	});
};