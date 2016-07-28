var request = require('request');
var session = require('express-session');
var cheerio = require('cheerio');
var config = require("../config");
var fs = require('fs');

exports.validate = function(req, callback) {
	if(req.cookies["openid"]){
		callback({result: true});
	}else{
		callback({result: false});
	}
};