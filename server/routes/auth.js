var express = require('express');
var router = express.Router();
var auth = require('../model/auth');

router.get('*', function(req, res, next) {
	auth.validate(req, function(data){
		if(data.result == true){
			next();
		}else{
			res.redirect('http://yao.holdfun.cn/boss/admin/login');
		}
	});
});

router.post('*', function(req, res, next) {
	auth.validate(req, function(data){
		if(data.result == true){
			next();
		}else{
			res.redirect('http://yao.holdfun.cn/boss/admin/login');
		}
	});
});

module.exports = router;
