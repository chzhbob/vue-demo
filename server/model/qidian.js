var request = require('request');
var querystring  = require('querystring');
var mysql = require('mysql');
var cheerio = require("cheerio");
var config = require("../config");

var article = require("../model/article");
var chapter = require("../model/chapter");

var host = 'http://wap.qidian.cn';
var headers = {
	'Accept-Encoding': 'utf-8',
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.1.2; zh-cn; LG-E988 Build/JZO54K) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'
    };

var articlesQueue = [];

var curArticleBase = '';
var newArticleId = '';

var chapterQueue = [];

exports.top = function(callback){
	callback();

	var url = host + '/top.aspx?top=3';
	urlGet(url, function(data){
		var $ = cheerio.load(data);
		$('.commonbox a').each(function(){
			if($(this).attr('href').indexOf('/book/showbook.aspx?bookid=') >= 0){
				articlesQueue.push($(this).attr('href'));
			}
		});
		getNextArticles();
	});
};

var getNextArticles = function(){
	var url = articlesQueue.pop();
	if(!url || url == ''){
		return false;
	}

	curArticleBase = url;
	newArticleId = '';

	getNextPageOfArticles();
};

var getNextPageOfArticles = function(callback){
	var nextUrl = curArticleBase = nextPage(curArticleBase);

	urlGet(host +　nextUrl, function(data){
		var $ = cheerio.load(data);
		if(!newArticleId || newArticleId == ''){
			var title = $('.tit02 h4').text();
			var desc = $('.bookinfo_txt').text();
			article.newArticle(2,nextUrl,title,desc, function(rows){
				newArticleId = rows.insertId
				getChapterUrl($, function(){
					getNextPageOfArticles();
				});
			});
		}else{
			getChapterUrl($, function(){
				getNextPageOfArticles();
			});
		}
	});
};

var getChapterUrl = function($, callback){
	var vipCounter = 0;
	$('.wap_content a').each(function(){
		if($(this).attr('href') && $(this).attr('href').indexOf('/book/bookreader.aspx') >= 0){
			
			if($(this).text().indexOf('(VIP)') >= 0 ){
				vipCounter++;
			}else{
				// 章节
				chapterQueue.unshift({
					article_id : newArticleId,
					url : $(this).attr('href')
				});
			}
		}
	});

	if(vipCounter == 10){
		getNextArticles();
	}else{
		getNextChapter(callback);	
	}
	
};


var getNextChapter = function(callback){
	var newChapter = chapterQueue.pop();

	if(!newChapter){
		callback();
		return false;
	}

	if(!newChapter.url || newChapter.url == ''){
		getNextChapter(callback);
		return false;
	}

	var url = host + newChapter.url + '&wordscnt=0';

	urlGet(url, function(data){
		var $ = cheerio.load(data);

		var title = $('h4').text();
		var content = $('#chpcontent').text();

		if(!title || !content || content.length < 10){
			getNextChapter(callback);
		}else{
			chapter.newChapter(newChapter.article_id, title, content, url, function(){
				getNextChapter(callback);
			});
		}
	});
};


var nextPage = function(url){
	var reg = /&pageindex=(.*?)&/;

	var urlMatch = reg.exec(url)
	if(!urlMatch){
		return url + '&pageindex=1&order=asc';
	}else{
		var pageIndex = urlMatch[1];
		if(!pageIndex){
			return url + '&pageindex=2&order=asc';
		}else{
			pageIndex = parseInt(pageIndex, 10);
			pageIndex += 1;
			url = url.replace(reg, '&pageindex='+ pageIndex +'&');
			return url;
		}
	}
};


var urlGet = function(url, callback){
	console.log('getting url：' + url);
	request.get({url: url, headers: headers}, function (error, response, body) {
		callback(body);
	});
};