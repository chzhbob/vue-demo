var express = require('express');
var router = express.Router();
var config = require("../config");

var opt = {};
if(config.env && config.env == 'dev'){
	opt['base'] = '/';
}else{
	opt['base'] = '/diy/'
}


/* GET home page. */
router.get('/edit', function(req, res, next) {
	var rid = req.query.rid;
	if(!rid){
		res.redirect('http://yao.holdfun.cn/boss/admin/login');
	}else{
		opt['title'] = '加载中';
		res.render('index', opt);
	}
	
});

router.get('/list', function(req, res, next) {
  res.render('list', opt);
});

router.get('/', function(req, res, next) {
  res.render('list', opt);
});

router.get('/new', function(req, res, next) {
  res.render('new', opt);
});

router.get('/template', function(req, res, next) {
  res.render('template', opt);
});

router.get('/create', function(req, res, next) {
	var resources = require('../model/resources');
	resources.createResource(req.query.serviceNo, req.query.serviceName, req.query.copyright, req.query.mpappid , req.cookies["boss_user_name"], function(data){
		if(req.query.template){
			var templates = require('../model/templates');
			templates.use(data.insertId, req.query.template, function(){
				opt['id'] = data.insertId;
				res.render('create', opt);	
			});
		}else{
			opt['id'] = data.insertId;
			res.render('create', opt);	
		}
		
	});
});

module.exports = router;
