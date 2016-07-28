var request = require('request');
var querystring  = require('querystring');
var mysql = require('mysql');
var cheerio = require("cheerio");
var config = require("../config");

exports.top = function(callback){
	var url = 'http://android.jjwxc.net/bookstore/getFullPage';

	var formData = {
		'channelBody' : '{"600005":{"limit":"3","offset":"0"},"700005":{"limit":"3","offset":"0"},"700015":{},"700000":{"limit":"3","offset":"0"},"800000":{"limit":"3","offset":"0"},"700010":{"limit":"3","offset":"0"},"600000":{},"100005":{"limit":"3","offset":"0"}}',
		'versionCode' : 37
	}

	var headers = {
		'Accept-Encoding': 'gzip',
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.1.2; zh-cn; LG-E988 Build/JZO54K) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'
    }

	// var r = request.defaults({'proxy':'http://localhost:8888'})

	request.post({url: url, form: formData, headers: headers}, function (error, response, body) {
		console.log(body);
	});

};

exports.getPageElementByRid = function(rid, callback) {
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query('SELECT rp.name as name, rpe.dom as dom, rpe.resource_page_id as page_id, rp.order as `order` FROM resource_page_elements rpe LEFT JOIN resource_pages rp ON rpe.resource_page_id = rp.id WHERE rp.resource_id = ' + parseInt(rid, 10), function(err, rows, fields){
	if (err) throw err;
		connection.end();
		callback(rows);
	});
};
