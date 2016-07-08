var config = require("../config");

var fs = require('fs');
var cheerio = require('cheerio');
var Entities = require('html-entities').XmlEntities;
var path = require('path');
var ncp = require('ncp').ncp;
var rimraf = require('rimraf');
var entities = new Entities();
var mysql = require('mysql');
var archiver = require('archiver');
var resources = require('../model/resources');

var libDir = config.make.libDir;
var tmplDir = config.make.tmplDir;
var targetDir = config.make.targetDir;
var configFileName = config.make.configFileName;

exports.build = function(cookiesName ,rid){
	// 复制基础文件
	var targetDir = config.make.targetDir + '/res_' + rid;
	resources.getResourceById(cookiesName ,rid, function(data){
		var res = data[0];
		rimraf(targetDir, function(){
			console.log('rimraf success!');
			copyFolder(targetDir, function(){
				console.log('copyFolder success!');

				var pages = require('../model/pages');

				pages.getPageElementByRid(rid, function(data){
						
						console.log('page making ' + data.length + ' elements');
						// 合并页元素和浮层元素
						var result = concatDom(data);
						for(var key in result){
							makeHtml(targetDir, tmplDir + '/index.html', targetDir , result[key].dom, res.name, res.copyright, result[key].order);
						}

						makeConfig(tmplDir + '/js/config.js',targetDir + '/js/config.js', res.serviceNo, res.mpappid);
				});

				
			});
		})
	});

	
};

var makeHtml = function(dir, source, destination, dbData, name, copyright, order){

	var data = fs.readFileSync(source,'utf-8');
	var $dbHtml = cheerio.load(dbData);
	var $fileHtml = cheerio.load(data.toString());

	if($fileHtml('body .main').length > 0){
		$fileHtml('body .main').remove();
	}
	$fileHtml('title').html(name);

	$fileHtml('body').prepend('\r\r<section class="main">\r</section>\r');

	// 主背景设置
	if($dbHtml('.main-wrapper').length > 0){
		var mainBgStyle = $dbHtml('.main-wrapper').css('background-image');	
		if(mainBgStyle){
			$fileHtml('.main').css('background', mainBgStyle.replace(/\"/g,""));  
		}
	}
	
	// 浮层元素
	$dbHtml('.dialog-wrapper').each(function(){
		var dialogId = $dbHtml(this).attr('id');
		if(dialogId){
			$fileHtml('body').prepend('\r\r<section id="'+ dialogId +'" class="dialog-wrapper none">\r</section>\r');

			$dbHtml(this).find('.content-item').each(function(){
				var dataX = $dbHtml(this).attr('data-x');
				var dataY = $dbHtml(this).attr('data-y');
				var width = $dbHtml(this).css('width');
				var height = $dbHtml(this).css('height');
				$dbHtml(this).find('.wrapper').attr('data-x', dataX).attr('data-y',dataY).css({
					'width' : width,
					'height' : height
				});

				var dom = $dbHtml(this).html()
				dom = dom.replace('background-image: url(&quot;', 'background-image: url(');
				dom = dom.replace('&quot;); background', '); background');

				$fileHtml('#' + dialogId).append(dom + '\r');
			});
		}
	});

	// 插入copyright元素
	$dbHtml('.copyright-wrapper').each(function(){
		if(copyright){
			$dbHtml(this).find('.copyright').html(copyright + '<br />' + 'Powered by holdfun.cn').addClass('done');
		}else{
			$dbHtml(this).find('.copyright').html('').addClass('done');
		}
		$fileHtml('.main').append($dbHtml(this).html() + '\r');
	});

	// 插入DOM元素
	$dbHtml('.main-wrapper .content-item').each(function(){
		var dataX = $dbHtml(this).attr('data-x');
		var dataY = $dbHtml(this).attr('data-y');
		var width = $dbHtml(this).css('width');
		var height = $dbHtml(this).css('height');
		$dbHtml(this).find('.wrapper').attr('data-x', dataX).attr('data-y',dataY).css({
			'width' : width,
			'height' : height
		});

		// 处理background-images url双引号问题
		var dom = $dbHtml(this).find('.content-item-main').html()
		dom = dom.replace('background-image: url(&quot;', 'background-image: url(');
		dom = dom.replace('&quot;); background', '); background');

		$fileHtml('.main').append(dom + '\r');
	});

	// 插入JS、CSS元素
	var tools = require('../model/tools');
	tools.getAllAsObject(function(allTools){

		$dbHtml('.content-item').each(function(){
			var id = $dbHtml(this).attr('type');
			
			// 插入模板文件
			$dbHtml(this).find('.tmpl').each(function(){
				var $tmpl = cheerio.load($dbHtml(this).html());
				$tmpl('[tmpl-attr]').each(function(){
					var attr = $tmpl(this).attr('tmpl-attr');
					var name = '${' + $tmpl(this).attr('tmpl-name') + '}';
					switch(attr){
						case "html":
							$tmpl(this).html(name);
							break;
						case "src":
							$tmpl(this).attr('src',name);
							break;
					}
				});
				var tmplHtml = '\r<script type="text/html" id="'+ $dbHtml(this).attr('id') +'">' + $tmpl.html() + '</script>\r';
				$fileHtml('body').append(tmplHtml);
			});

			// 插入CSS文件

			if(allTools[id].css){
				var cssArr = JSON.parse(allTools[id].css);
				for(var i in cssArr){
					var cssName = path.basename(cssArr[i]);
					$fileHtml('head').append('\r<link rel="stylesheet" href="./css/'+cssName+'">\r');
					fs.createReadStream(libDir + '/' + cssArr[i]).pipe(fs.createWriteStream(dir + '/css/' + cssName));
				}
			}

			// 插入JS文件
			if(allTools[id].js){
				var jsArr = JSON.parse(allTools[id].js);
				for(var i in jsArr){
					var jsName = path.basename(jsArr[i]);
					$fileHtml('body').append('\r<script src="./js/app/'+jsName+'"></script>\r');
					fs.createReadStream(libDir + '/' + jsArr[i]).pipe(fs.createWriteStream(dir + '/js/app/' + jsName));
				}
			}
			
		});

		$fileHtml('.tmpl').remove();
		// 写入文件
		if(order == 1){
			order = '';
		}
		fs.writeFile(destination + '/index'+order+'.html', entities.decode($fileHtml.html()), { flag: 'w+' }, function (err) {
			if (err) throw err;
			console.log(destination + '/index'+order+'.html ' + ' saved!');
		});
	});

};


var makeConfig = function(source,destination, serviceNo, mpappid){
	var data = fs.readFileSync(source,'utf-8');
	data = data.replace(/\{\$serviceNo\}/g, serviceNo);
	data = data.replace(/\{\$mpappid\}/g, mpappid);

	fs.writeFile(destination, data, function (err) {
		if (err) throw err;
		console.log(destination + ' saved!');
	});
}

exports.download = function(rid, callback){
	var output = fs.createWriteStream(config.make.targetDir + '/res_' + rid +'.zip');
	var archive = archiver('zip');
	archive.pipe(output);

	output.on('close',function(){
		callback('./preview/res_' + rid + '.zip');
	});	

	archive.directory(config.make.targetDir + '/res_' + rid , false).finalize();

	

	return ;
};


var copyFolder = function(dir, callback){
	ncp.limit = 5;
	ncp(tmplDir, dir, function (err) {
		if (err) {
			return console.error(err);
		}
		callback();
	});
};


var concatDom = function(data){
	var domObject = {};
	for(var i in data){
		if(domObject[data[i].page_id]){
			domObject[data[i].page_id].dom += data[i].dom;
		} else{
			domObject[data[i].page_id] = {};
			domObject[data[i].page_id].dom = data[i].dom;
		}
		domObject[data[i].page_id].name = data[i].name;
		domObject[data[i].page_id].order = data[i].order;
	}
	return domObject;
};

exports.init = function(){

	emptyDb(function(){
		var data = fs.readdirSync(libDir);
		for(var i in data){
			var packageName = libDir + '/' + data[i] + '/' + configFileName;
			if(fs.existsSync(packageName)){
				var configStr = fs.readFileSync(packageName,'utf-8');	
				var packageConfig = JSON.parse(configStr);
				insertTools(packageConfig);
				insertEvents(packageConfig);
				insertExports(packageConfig);
				insertAttrs(packageConfig);

			}
		}
	});
};

var emptyDb = function(callback){
	var connection = mysql.createConnection(config.mysqlConfig);
	connection.connect();
	connection.query("TRUNCATE TABLE `tools`;", function(err, rows, fields){
	if (err) throw err;
		connection.query("TRUNCATE TABLE `tool_exports`;", function(err, rows, fields){
		if (err) throw err;
			connection.query("TRUNCATE TABLE `tool_events`;", function(err, rows, fields){
			if (err) throw err;
				connection.query("TRUNCATE TABLE `tool_attributes`;", function(err, rows, fields){
				if (err) throw err;
					connection.end();
					callback();
				});
			});
		});
	});
};


var insertTools = function(packageConfig){
	var html = libDir + '/' + packageConfig.html;
	if(fs.existsSync(html)){

		var defaultStyle = "";
		if(packageConfig.defaultStyle){
			defaultStyle = JSON.stringify(packageConfig.defaultStyle);
		}

		var jsStr = '';
		if(packageConfig.js){
			jsStr = JSON.stringify(packageConfig.js);
		}

		var cssStr = '';
		if(packageConfig.js){
			cssStr = JSON.stringify(packageConfig.css);
		}

		var htmlStr = fs.readFileSync(html,'utf-8');	
		var connection = mysql.createConnection(config.mysqlConfig);
		connection.connect();
		connection.query("INSERT INTO `tools`(`id`,`html`,`name`,`css`,`js`,`type`,`version`,`category_id`,`icon`,`default_style`,`auth`,`parent`,`img`) VALUES ('"+parseInt(packageConfig.uuid, 10)+"',"+connection.escape(htmlStr)+","+connection.escape(packageConfig.name)+","+connection.escape(cssStr)+","+connection.escape(jsStr)+","+connection.escape(packageConfig.type)+","+connection.escape(packageConfig.version)+","+connection.escape(packageConfig.category)+","+connection.escape(packageConfig.icon)+ ","+ connection.escape(defaultStyle) + "," + connection.escape(packageConfig.auth) + "," + connection.escape(packageConfig.parent) + "," + connection.escape(packageConfig.img) + ");", function(err, rows, fields){
		if (err) throw err;
			connection.end();
		});	

	}
};

var insertEvents = function(packageConfig){
	var connection = mysql.createConnection(config.mysqlConfig);

	var sqlStr = "";
	for(var i in packageConfig.events){
		sqlStr += "('"+parseInt(packageConfig.uuid, 10)+"',"+connection.escape(packageConfig.events[i])+","+connection.escape(i) +"),";
	}
	
	if(sqlStr != ""){
		sqlStr = sqlStr.substr(0, sqlStr.length - 1);
		connection.connect();
		connection.query("INSERT INTO `tool_events`(`tool_id`, `desc`, `name`) VALUES" + sqlStr, function(err, rows, fields){
		if (err) throw err;
			connection.end();
		});	
	}else{
		connection.end();
	}
};


var insertExports = function(packageConfig){
	var connection = mysql.createConnection(config.mysqlConfig);

	var sqlStr = "";
	for(var i in packageConfig.exports){
		sqlStr += "('"+parseInt(packageConfig.uuid, 10)+"',"+connection.escape(packageConfig.exports[i])+","+connection.escape(i) +"),";
	}
	
	if(sqlStr != ""){
		sqlStr = sqlStr.substr(0, sqlStr.length - 1);
		connection.connect();
		connection.query("INSERT INTO `tool_exports`(`tool_id`, `desc`, `name`) VALUES" + sqlStr, function(err, rows, fields){
		if (err) throw err;
			connection.end();
		});	
	}else{
		connection.end();
	}
};

var insertAttrs = function(packageConfig){
	var connection = mysql.createConnection(config.mysqlConfig);

	var sqlStr = "";
	for(var i in packageConfig.attributes){
		sqlStr += "('"+parseInt(packageConfig.uuid, 10)+"',"+connection.escape(packageConfig.attributes[i].desc) +","+connection.escape(packageConfig.attributes[i].name)+","+connection.escape(packageConfig.attributes[i].selector) +"),";
	}
	
	if(sqlStr != ""){
		sqlStr = sqlStr.substr(0, sqlStr.length - 1);
		connection.connect();
		connection.query("INSERT INTO `tool_attributes`(`tool_id`, `desc`, `name`, `selector`) VALUES" + sqlStr, function(err, rows, fields){
		if (err) throw err;
			connection.end();
		});	
	}else{
		connection.end();
	}
};