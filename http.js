'use strict';

var fs = require('fs');
var http = require('http');
var url = require('url');
var log = console.log;

var server = http.createServer(function(request, response) {

	//这个最大的坑就是，如果访问一个目录文件夹，比如resume
	//加上 / 访问 resume/
	//和直接访问  resume
	//解析出来的fs.stat内对于根目录的定位是不同的
	//尝试多种方法后，最终使用对于没有 / 的文件访问采取重定向到含 / 文件的方法。

	var filepath = '.' + url.parse(request.url).pathname;
	fs.stat(filepath, function(err, stats) {
		
		
		//路径为目录
		if (!err && stats.isDirectory() && (filepath.charAt(filepath.length - 1) != '/')) {
			//不带'/'的路径，重定向到带'/'的路径
			response.writeHead(302, {
				'Location': '/'+filepath + '/'
			});
			response.end();
		} else if (!err && stats.isDirectory()) {
			//带'/'的路径，添加index.html为默认
			filepath += 'index.html';

			fs.stat(filepath, function(err, stats) {
				log('请求', filepath)
				if (!err && stats.isFile()) {
					log('完成请求', filepath)
					response.writeHead(200);
					fs.createReadStream(filepath).pipe(response);
				} else {
					log('404:不存在此文件')
					response.writeHead(404);
					response.end('404');
				}

				log('-------------------------------');
			})
		} else if (!err && !stats.isDirectory()) {
			//路径为文件

			fs.stat(filepath, function(err, stats) {
				log('请求文件', filepath)

				if (!err && stats.isFile()) {
					log('文件读取完成', filepath)
					response.writeHead(200);
					fs.createReadStream(filepath).pipe(response);
				}
				log('-------------------------------');
			})
		} else {
			log('请求', filepath)
			log('404: 错误的路径')
			response.writeHead(404);
			response.end('404: File Not Found');
			log('-------------------------------');
		}
	});
});

// 让服务器监听80端口:
server.listen(80);
log('Server is running');