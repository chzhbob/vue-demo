var express = require('express');
var router = express.Router();
var auth = require('../model/auth');

router.get('*', function(req, res, next) {
	auth.validate(req, function(data){
		if(data.result == true){
			next();
		}else{
			res.jsonp({code: 403});
		}
	});
});

router.post('*', function(req, res, next) {
	auth.validate(req, function(data){
		if(data.result == true){
			next();
		}else{
			res.jsonp({code: 403});
		}
	});
});

module.exports = router;
