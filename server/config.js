var config = module.exports;

config.mysqlConfig = {
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'wecan'
};

// config.mysqlConfig = {
// 	host     : 'testzqtv.mysql.rds.aliyuncs.com',
// 	user     : 'tv_test',
// 	password : 'zq_2014_tv_test',
// 	database : 'diy'
// };

config.make = {
	libDir	: './lib',
	tmplDir : './template',
	targetDir : './public/preview',
	configFileName	: 'package.json'
};

config.env = 'dev';