var express = require('express');
var cheerio = require('cheerio');
var router = express.Router();
var config = require("../config");

/*---------------tools-----------*/
router.get('/list', function(req, res, next) {
	
	var items = [
	{
		img: './imgs/avatar.jpg',
		title: '第一条条目',
		like: 123
	},{
		img: './imgs/avatar.jpg',
		title: '第二条条目',
		like: 132
	},{
		img: './imgs/avatar.jpg',
		title: '第三条条目',
		like: 62
	},{
		img: './imgs/avatar.jpg',
		title: '第四条条目',
		like: 15
	},{
		img: './imgs/avatar.jpg',
		title: '第五条条目',
		like: 32
	},{
		img: './imgs/avatar.jpg',
		title: '第六条条目',
		like: 22
	},{
		img: './imgs/avatar.jpg',
		title: '第七条条目',
		like: 14
	},{
		img: './imgs/avatar.jpg',
		title: '第八条条目',
		like: 22
	}];


	res.jsonp({code: 0, data: items});
	
});


module.exports = router;