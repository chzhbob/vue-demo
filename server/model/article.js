var request = require('request');
var querystring  = require('querystring');
var mysql = require('mysql');
var config = require("../config");
var moment = require("moment");
var redis = require('redis');
var client = redis.createClient();


exports.getList = function(callback){
	client.get('ARTICLE_GET_LIST', function(err, obj){
		if(!obj){
			var connection = mysql.createConnection(config.mysqlConfig);
			connection.connect();
			connection.query('SELECT * FROM article', function(err, rows, fields){
			if (err) throw err;
				connection.end();
				console.log(rows);
				client.set('ARTICLE_GET_LIST', JSON.stringify(rows));
				callback(rows);
			});
		}else{
			callback(JSON.parse(obj));
		}
	});
};

exports.getHome = function(uid, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT a.*,ua.page FROM `article` a LEFT JOIN `user_article` ua ON a.id = ua.`article_id` LEFT JOIN `user` u ON u.id = ua.`user_id` WHERE u.id = ' + parseInt(uid, 10) + ' ORDER BY ua.`created_at` DESC', function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.newArticle = function(type, url, title, desc, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query("insert into article(`source_id`, `from_url`, `title`, `desc`, `created_at`)" 
	+ " values('"+type+"','"+url+"','"+title.trim()+"','"+desc.trim()+"','"+moment().format()+"')", function(err, rows, fields){
		if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.follow = function(uid, aid, cid, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query("insert into user_article(`user_id`, `article_id`, `page`, `created_at`, `modified_at`)" 
	+ " values('"+uid+"','"+aid+"','"+cid+"','"+moment().format() + "','" + moment().format() +"')", function(err, rows, fields){
		if (err) throw err;
		connection.end();
		callback(rows);
	});
};

exports.followed = function(uid, aid, cid, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT * FROM user_article WHERE `user_id`=' + uid + ' AND `article_id`=' + aid + ' LIMIT 1' , function(err, rows, fields){
		if (err) throw err;
		connection.end();
		
		if(rows[0]){
			callback(true);
			if(rows[0] && rows[0].page && rows[0].page < cid){
				updateUserArticle(uid, aid, cid);
			}
		}else{
			callback(false);
		}
	});
};

exports.detail = function(aid, callback){
	if(!aid || aid == 0){
		callback(0);
		return;
	}

	getDetail(aid, function(detail){
		getTotal(aid, function(total){
			callback({
				detail : detail,
				total : total
			});
		});
	});
	
}

var getDetail = function(aid, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT * FROM article WHERE `id` = ' + parseInt(aid, 10) , function(err, rows, fields){
	if (err) throw err;
		connection.end();
		if(rows.length > 0){
			callback(rows[0]);
		}else{
			callback(null);
		}
		
	});
}

var getTotal = function(aid, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT COUNT(1) FROM chapter WHERE `article_id` = ' + parseInt(aid, 10) , function(err, rows, fields){
	if (err) throw err;
		connection.end();
		if(rows.length > 0){
			callback(rows[0]['COUNT(1)']);
		}else{
			callback(0);
		}
		
	});
}

var updateUserArticle = function(uid, aid, cid){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('update user_article ua set ua.`page` = ' + parseInt(cid, 10) + ' where ua.`article_id` = '+parseInt(aid, 10)+' and ua.`user_id` = ' + parseInt(uid, 10), function(err, rows, fields){
	if (err) throw err;
		connection.end();
	});
}