var mysql = require('mysql');
var config = require("../config");

exports.getTemplatesByCategoryId = function(cid ,callback) {
	var whereStr = '';
	cid = parseInt(cid, 10);
	if(cid > 0){
		whereStr = ' WHERE t.category_id =' + cid;
	}

	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT t.*,tc.id AS cid,tc.`name` AS cname FROM templates t LEFT JOIN template_categories tc ON t.`category_id` = tc.`id`' + whereStr, function(err, rows, fields){
		if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.use = function(rid, tid, callback) {
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();

	connection.query('SELECT * FROM `template_pages` tp WHERE tp.template_id = ' + tid + ';', function(err, rows, fields){
		if (err) throw err;
		for(var i in rows){
			insertResourcePages(rid, rows[i].name, rows[i].desc, rows[i].id, rows[i].order);
		}
		connection.end();
		callback(rows);
	});
};

var insertResourcePages = function(rid, name, desc, tpid, order){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();

	connection.query('INSERT INTO `resource_pages`(`resource_id`,`name`,`desc`,`order`) VALUE('+rid+',"'+name+'","'+desc+'","' + order + '");', function(err, rows, fields){
		if (err) throw err;
		insertResourcePageElements(tpid, rows.insertId);
		connection.end();
	});

	
};

var insertResourcePageElements = function(tpid, insertId){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('INSERT INTO resource_page_elements(`resource_page_id`,`name`,`desc`,`type`, `dom`, `order`) SELECT "'+insertId+'",tpe.name,tpe.desc,tpe.type,tpe.dom,tpe.order FROM template_page_elements tpe WHERE tpe.template_page_id = ' + tpid, function(err, rows, fields){
		if (err) throw err;
		connection.end();
	});
};

exports.makeTmplByResourceId = function(req, rid, callback){
	var resources = require('../model/resources');
	var pages = require('../model/pages');

	resources.getResourceById(req.cookies["boss_user_name"], rid, function(data){
		newTmpl(data[0].name, data[0].desc, function(rows){
			var newTmplId = rows.insertId;
			pages.getAllPagesByRid(rid, function(pages){
				for(var i in pages){
					insertTemplatePages(newTmplId, pages[i].name, pages[i].desc, pages[i].id, pages[i].order);
				}
				callback(rows);
			});
		});

	});
};

var newTmpl = function(name, desc, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('INSERT INTO `templates`(`category_id`,`name`,`desc`) VALUE(0,"'+name+'","'+desc+'");', function(err, rows, fields){
		if (err) throw err;
		callback(rows);
		connection.end();
	});
};


var insertTemplatePages = function(tmplId, name, desc, rpid, order){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();

	connection.query('INSERT INTO `template_pages`(`template_id`,`name`,`desc`,`order`) VALUE('+tmplId+',"'+name+'","'+desc+'","' + order + '");', function(err, rows, fields){
		if (err) throw err;
		insertTemplatePageElements(rpid, rows.insertId);
		connection.end();
	});
};

var insertTemplatePageElements = function(rpid, insertId){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('INSERT INTO template_page_elements(`template_page_id`,`name`,`desc`,`type`, `dom`, `order`) SELECT "'+insertId+'",tpe.name,tpe.desc,tpe.type,tpe.dom,tpe.order FROM resource_page_elements tpe WHERE tpe.resource_page_id = ' + rpid, function(err, rows, fields){
		if (err) throw err;
		connection.end();
	});	
};