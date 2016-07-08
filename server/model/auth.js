var request = require('request');
var session = require('express-session');
var cheerio = require('cheerio');
var config = require("../config");
var fs = require('fs');

exports.validate = function(req, callback) {
	var url = 'http://' + req.headers.host + '/boss/admin/asyncVerify';

	if(config.env && config.env == 'dev'){
		callback({result: true});
		return;
	}

	if(req.cookies["boss_user_name"] && req.cookies["boss_user_pwd"]){
		
		if(req.session[req.cookies["boss_user_name"]] && req.session[req.cookies["boss_user_name"]] == req.cookies["boss_user_pwd"] ){
			callback({result: true});
		}else{
			var jar = request.jar();
			request = request.defaults({jar: true});
			jar.setCookie(request.cookie('boss_user_name=' + req.cookies["boss_user_name"]), url);
			jar.setCookie(request.cookie('boss_user_pwd=' + req.cookies["boss_user_pwd"]), url);

			// 代理，fiddler用
			// var r = request.defaults({'proxy':'http://localhost:8888'})

			request({url: url, jar: jar}, function (error, response, body) {
				if(body == 'true'){
					req.session[req.cookies["boss_user_name"]] = req.cookies["boss_user_pwd"]; 
					callback({result: true});
				}else{
					callback({result: false});
				}
			});
		}
	}else{
		callback({result: false});
	}
};


exports.addAuth = function(rid, req, callback){
	var resources = require('../model/resources');
	var pages = require('../model/pages');
	var tools = require('../model/tools');

	if(config.env && config.env == 'dev'){
		callback({code: 0});
		return;
	}

	resources.getResourceById(req.cookies["boss_user_name"], rid, function(data){
		if(data.length > 0){
			var serviceNo = data[0].serviceNo;
			pages.getAllElementByRid(rid, function(rows){
				var types = {};
				for(var i in rows){
					if(rows[i].dom){
						var $ = cheerio.load(rows[i].dom);
						$('.content-item').each(function(){
							var type = $(this).attr('type');
							types[type] = type;
						});
					}
				}

				tools.getAuthByIds(types, function(rows){
					var authStr = '';
					for(var i in rows){
						if(rows[i].auth){
							authStr += rows[i].auth + ',';
						}
					}
					authStr = authStr.substr(0, authStr.length - 1);

					if(authStr == ''){
						callback({code: 0});
						return;
					}

					if(req.cookies["boss_user_name"] && req.cookies["boss_user_pwd"]){
						var url = 'http://' + req.headers.host + '/boss/role/add4PermissionGroup?serviceNo=' + serviceNo + '&groups=' + authStr;
						var jar = request.jar();
						request = request.defaults({jar: true});
						jar.setCookie(request.cookie('boss_user_name=' + req.cookies["boss_user_name"]), url);
						jar.setCookie(request.cookie('boss_user_pwd=' + req.cookies["boss_user_pwd"]), url);

						request({url: url, jar: jar}, function (error, response, body) {
							if(body == 0){
								callback({code: 0});
							}else{
								callback({code: 1, message: '接口错误'});
							}
						});

					}else{
						callback({code: 1, message: '没有权限'});
						return;
					}
					
				});		

			});
		}
	});

};

exports.updatePreview = function(req, rid, href){
	var resources = require('../model/resources');
	resources.getResourceById(req.cookies['boss_user_name'], rid, function(data){
		var serviceNo = data[0].serviceNo;

		if(req.cookies["boss_user_name"] && req.cookies["boss_user_pwd"]){
			var url = 'http://' + req.headers.host + '/boss/resource/tzPreview?serviceNo=' + serviceNo + '&url=' + encodeURIComponent(href);
			var jar = request.jar();
			request = request.defaults({jar: true});
			jar.setCookie(request.cookie('boss_user_name=' + req.cookies["boss_user_name"]), url);
			jar.setCookie(request.cookie('boss_user_pwd=' + req.cookies["boss_user_pwd"]), url);

			// 代理，fiddler用
			// var r = request.defaults({'proxy':'http://localhost:8888'})

			request({url: url, jar: jar}, function (error, response, body) {
				if(body == 'true'){
					return true;
				}else{
					return false;
				}
			});

		}else{
			return false
		}
	});
};

exports.release = function(req, rid, filePath, callback){
	var resources = require('../model/resources');
	resources.getResourceById(req.cookies['boss_user_name'], rid, function(data){
		var serviceNo = data[0].serviceNo;

		if(req.cookies["boss_user_name"] && req.cookies["boss_user_pwd"]){
			var url = 'http://' + req.headers.host + '/boss/resource/tzSave';
			var jar = request.jar();
			request = request.defaults({jar: true});
			jar.setCookie(request.cookie('boss_user_name=' + req.cookies["boss_user_name"]), url);
			jar.setCookie(request.cookie('boss_user_pwd=' + req.cookies["boss_user_pwd"]), url);

			var formData = {
				rid: rid,
				serviceNo: serviceNo,
				file: {
					value: fs.createReadStream(filePath),
					options: {
						filename: 'res.zip',
						contentType: 'application/x-zip-compressed '
					}
				}
			};
			// 代理，fiddler用
			// var r = request.defaults({'proxy':'http://localhost:8888'})

			request.post({url:url, formData: formData, jar: jar}, function(err, httpResponse, body) {
				console.log('Upload successful!  Server responded with:', body);
				callback(body);
			});

		}else{
			return false
		}
	});
};