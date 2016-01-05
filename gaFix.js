var express = require('express');
var app = express();
var fs = require("fs")
var httpProxy = require('http-proxy');
var http = require('http');
var host = 'http://127.0.0.1:4000';
var port = 4000;

var updateFile = function(){
	console.log('updatefile calling');
var options = {
  hostname: 'www.google-analytics.com',
  port: 80,
  path: '/analytics.js',
  headers: {
  	'Host' : 'www.google-analytics.com'
  },
  method: 'GET'
};

console.log(options);
var req = http.request(options, function(res) {
  console.log('headers:\n' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    //console.log('body:\n' + chunk);
    var updatedJs = chunk.replace(/www.google-analytics.com/g, '127.0.0.1:4000');
//console.log('body:\n' + updatedJs);
	fs.writeFile('analytics.js', updatedJs, function (err) {
  if (err) return console.log(err);
  console.log('Analytics File updated successfully.');
});	

  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
req.end();


}

var proxy = httpProxy.createProxyServer({});

app.set('port', port);

app.get('*', function (req, res, next) {
	console.log(req.url);
	next();
});

app.get('/analytics.js', function (req, res) {
	var data = fs.readFileSync('analytics.js');
	updateFile();
	res.setHeader('content-type', 'text/javascript');
  	res.send(data.toString());
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Host', 'www.google-analytics.com');
});

app.get('/collect', function (req, res) {
        return proxy.web(req, res , { target: "http://www.google-analytics.com" } );
});

var server = http.createServer(app, function(req, res) {
	console.log(req.url);
//  proxy.web(req, res, { target: 'http://127.0.0.1:5060' });
});

console.log("listening on port 4000")
server.listen(4000);
