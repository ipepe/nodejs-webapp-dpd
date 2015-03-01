//Author: Patryk "ipepe" Ptasiński npm@ipepe.pl, credit to: schettino72
// ==================== Load dependencies
var deployd = require('deployd');
var url = require('url');
var request = require('request');
var internalClient = require('deployd/lib/internal-client');
// ==================== Server Envs
var server_env = process.env.NODE_ENV || 'development';
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
// ==================== Database Envs
var db_ip_address = process.env.OPENSHIFT_MONGODB_DB_HOST || server_ip_address;
var db_url_address = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://deployd:deployd@'+db_ip_address+':27017/deployd';
var db_parsed_url = url.parse(db_url_address);
// ==================== Output current app config
console.log(server_env);
console.log(server_ip_address + ':' + server_port);
console.log(db_url_address);
// ==================== Configure DeployD instance
var dpdic = false;

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
	dpdic = internalClient.build(process.server);
});
// ==================== Catch Errors
server.on('error', function(err) {
	console.error(err);
    // Give the server a chance to return an error
    process.nextTick(function() {
    	process.exit();
    });
});
// ==================== My scrape code

var timers = {
	second: 1000,
	minute: 1000*60,
	hour: 1000*60*60,
	day: 1000*60*60*24,
	month: 1000*60*60*24*30
}
var options = {
	url: 'http://www.reddit.com/r/AdviceAnimals/search.json?q=site%3Ai.imgur.com&restrict_sr=on&sort=top&t=day',
	headers: { 'User-Agent': 'Mozilla/5.0 (nodejs/request:2.53.0) If this bot is naughty, please contact me at requestbot@ipepe.pl' }
};
function getImgurAlbum(p_imgur_album_url){
		// jest albumem
		// urlGetJson(https://api.imgur.com/3/album/hMBK4, callback)
		// callback(x){ return x.data.cover }
}
function parseImgurl(p_url){
	return p_url;

	if(p_url.match(/\.(jpeg|jpg|gif|png)$/) !== null){
		return p_url;
	}else if(p_url.match(/\.(webm|gifv)$/) !== null){
		return p_url.substring( p_url.lastIndexOf(".")+1,0 ) + 'gif';
	}else if(p_url.indexOf('imgur.com/') > -1){
		if(p_url.indexOf('i.imgur.com') > -1){
			return p_url;
		}else if(p_url.indexOf('imgur.com/a/') > -1){
			getImgurAlbum(p_url);
			return false;
		}else{
			return p_url.replace('imgur.com','i.imgur.com')+'.jpg';
		}
	}else if(p_url.indexOf('livememe.com/') > -1){
		return 'http://i.lvme.me/' + p_url.substring(p_url.indexOf('livememe.com/')+13) + '.jpg';
	}else if(p_url.indexOf('imgflip.com/') > -1){
		if(p_url.indexOf('#') > -1){
			return 'https://i.imgflip.com/' + p_url.substring( p_url.indexOf('imgflip.com/i/')+14, p_url.indexOf('#')) + '.jpg';
		}else{
			return 'https://i.imgflip.com/' + p_url.substring( p_url.indexOf('imgflip.com/i/')+14) + '.jpg';
		}
	}else if(p_url.indexOf('makeameme.org/meme/') > -1){
		return 'http://makeameme.org/media/created/' + p_url.substring(p_url.indexOf('makeameme.org/meme/')+19) + '.jpg';
	}

	return false;
	// return 'http://pagepeeker.com/thumbs.php?size=x&p_url=' + p_url;
}
function loadDataIntoDpd(p_data_url, p_data_title){
	data_url = parseImgurl(p_data_url);
	if(data_url){
		dpdic.adviceanimals.post( { imgurl : data_url, title: p_data_title } , resultErrorConsole);
	}else{
		dpdic.unknownurl.post( { url: p_data_url } , resultErrorConsole)
	}
}
function resultErrorConsole(result, error){
	if(result) console.log(result);
	if(error) if(error.toString().indexOf("duplicate imgurl") < 0) console.error( error );
}
function requestCallback(err, res, body) {
	if(!err && res.statusCode == 200){
		wyniki = JSON.parse(body);
		wyniki.data.children.forEach(function(each){
			loadDataIntoDpd(each.data.url, each.data.title);
		});
	}
}
function intervalFunction(){
	console.log('intervalFunction running at: ' + ( new Date() ) );
	request(options, requestCallback);
}
//Cron-like
var nowJob = setTimeout( intervalFunction, timers.second*10 );
var cronJob = setInterval( intervalFunction, timers.hour);
