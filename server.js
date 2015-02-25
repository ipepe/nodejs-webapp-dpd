// ==================== Load dependencies
var deployd = require('deployd');
var request = require('request');
var url = require('url');

// ==================== Server Envs
var server_env = process.env.NODE_ENV || 'development';
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
// ==================== Database Envs
var db_ip_address = process.env.OPENSHIFT_MONGODB_DB_HOST || server_ip_address;
var db_url_address = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://deployd:deployd@'+db_ip_address+':27017/';
var db_parsed_url = url.parse(db_url_address);
// ==================== Output current app config
console.log(server_env);
console.log(server_ip_address + ':' + server_port);
console.log(db_url_address);
// ==================== Configure DeployD instance
var server = deployd({
	port: server_port,
	env: server_env,
	db: {
		host: db_parsed_url.hostname,
		port: parseInt(db_parsed_url.port),
		name: db_parsed_url.pathname.slice(1),
		credentials: {
			username: db_parsed_url.auth.split(':')[0],
			password: db_parsed_url.auth.split(':')[1]
		}
	}
});
// ==================== Listen
server.listen(server_port, server_ip_address);
server.on('listening', function() {
	console.log("Server is listening");
});
// ==================== Catch Errors
server.on('error', function(err) {
	console.error(err);
	process.nextTick(function() { // Give the server a chance to return an error
		process.exit();
	});
});

// ==================== My scrape code

// var options = {
// 	url: 'http://www.reddit.com/.json',
// 	headers: {
// 		'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.0) Gecko/20100101 Firefox/31.0'
// 	}
// };
 
// function requestCallback(err, res, body) {
// 	if(!err && res.statusCode == 200){
// 		wyniki = JSON.parse(body);
// 		wyniki.data.children.forEach(function(each){
// 			dpdic.redditfront.post( { url : each.data.url } , function(result, error){
// 				if(error){
// 					console.log('Error: ' + error + ' url:' + each.data.url );
// 				}else{
// 					console.log('Result - id:' + result.id + ' url:' + result.url );
// 				}
// 			});
// 		});
// 	}
// }
// function intervalFunction(){
// 	console.log('intervalFunction running');
// 	request(options, requestCallback);
// }
// intervalFunction();
// // var onceJob = setTimeout ( intervalFunction, 1000*10);
// var cronJob = setInterval( intervalFunction, 1000*600);









