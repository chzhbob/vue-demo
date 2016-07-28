var express = require('express');
var cheerio = require('cheerio');
var router = express.Router();
var config = require("../config");
var jjwxc = require("../model/jjwxc");
var qidian = require("../model/qidian");

/*---------------tools-----------*/
router.get('/', function(req, res, next) {
	res.render('refresh');
});

router.get('/jjwxc', function(req, res, next) {
	jjwxc.top(function(){
		res.render('refresh');
	});
});

router.get('/qidian', function(req, res, next) {
	qidian.top(function(body){
		console.log(body);
		res.render('refresh' , {
			data : body
		});
	});
});


module.exports = router;