var server_env = process.env.NODE_ENV || 'development';
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var db_ip_address = process.env.OPENSHIFT_MONGODB_DB_HOST || server_ip_address;

console.log(server_env);
console.log(server_ip_address + ':' + server_port);

var deployd = require('deployd');
var server = deployd({
	port: server_port,
	env: server_env,
	db: {
		host: db_ip_address,
		port: 27017,
		name: 'deployd',
		credentials: {
			username: 'deployd',
			password: 'deployd'
		}
	}
});

server.listen(server_port, server_ip_address);
	server.on('listening', function() {
		console.log("Server is listening");
});
server.on('error', function(err) {
	console.error(err);
	process.nextTick(function() { // Give the server a chance to return an error
		process.exit();
	});
});