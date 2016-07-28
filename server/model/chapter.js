var request = require('request');
var querystring  = require('querystring');
var mysql = require('mysql');
var config = require("../config");
var moment = require("moment");
var redis = require('redis');
var client = redis.createClient();

var KEY_PREFIX = 'chapter_';

exports.get = function(aid, cid, callback){
	if(!aid || aid == 0){
		callback(null);
		return;
	}

	if(!cid || cid <= 0){
		cid = 1;
	}

	client.hgetall(KEY_PREFIX + aid + '_' + cid, function(err, obj){
		if(!obj){
			var connection = mysql.createConnection(config.mysqlConfig);
			connection.connect();
			connection.query('SELECT * FROM chapter WHERE `article_id` = ' + parseInt(aid, 10) + ' ORDER BY `id` ASC LIMIT '+(parseInt(cid) - 1)+',1', function(err, rows, fields){
			if (err) throw err;
				connection.end();
				if(rows.length > 0){
					rows[0].content = rows[0].content.replace(/　/g, '<br />');
					client.hmset(KEY_PREFIX + aid + '_' + cid, rows[0]);
					callback(rows[0]);
				}else{
					callback(null);
				}
				
			});
		}else{
			callback(obj);
		}
	});
};

exports.newChapter = function(article_id, title, content, url, callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query("insert into chapter(`article_id`, `title`, `content`, `created_at`, `num`, `url`)" 
	+ " values('"+article_id+"','"+title.trim()+"','"+content.trim()+"','"+moment().format()+"','0','"+url+"')", function(err, rows, fields){
		if (err) throw err;
		connection.end();
		callback();
	});
};