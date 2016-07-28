var express = require('express');
var cheerio = require('cheerio');
var router = express.Router();
var config = require("../config");
var article = require("../model/article");
var chapter = require("../model/chapter");


/*---------------tools-----------*/
router.get('/list', function(req, res, next) {
	article.getList(function(result){
		res.jsonp({code: 0, data: result});
	});
});


router.get('/home', function(req, res, next) {
	article.getHome(req.cookies["openid"], function(result){
		res.jsonp({code: 0, data: result});
	});
});


router.get('/detail', function(req, res, next) {

	var aid = req.query.aid;
	if(!aid){
		res.jsonp({code: 1, data: null});
		return;
	}

	var cid = req.query.cid;
	chapter.get(aid, cid, function(result){
		article.detail(aid, function(detail){
			article.followed(req.cookies["openid"], aid, cid, function(followed){
				res.jsonp({code: 0, data: result,article: detail.detail.title, total: detail.total, followed: followed});	
			});
		})
	});

});

router.get('/follow', function(req, res, next) {

	var aid = req.query.aid;
	if(!aid){
		res.jsonp({code: 1, data: null});
		return;
	}

	var cid = req.query.cid;
	if(!cid){
		res.jsonp({code: 1, data: null});
		return;
	}

	article.follow(req.cookies["openid"], aid, cid, function(result){
		res.jsonp({code: 0, data: result});	
	});

});

module.exports = router;