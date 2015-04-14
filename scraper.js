// ==================== My scrape code
console.log('Scraper.js imported');

module.exports = function (p_dpd_ic, p_colors, p_webs_array ) {
	console.log('Scraper instance created');

	var scraperInstance = {};
	// var internalClient = require('deployd/lib/internal-client');

	// scraperInstance.dpd_ic = internalClient.build(process.server);
	// scraperInstance.dpd_ic = require('deployd/lib/internal-client').build(process.server);
	scraperInstance.dpd_ic = p_dpd_ic;
	scraperInstance.webs_array = p_webs_array;
	scraperInstance.webs_interation = 0;
	scraperInstance.colors = p_colors;
	scraperInstance.request = require('request');
	scraperInstance.request_options = {
		headers: { 'User-Agent': 'NodeJS-Request/2.53.0 (If this bot is naughty, please contact me at webappbot@ipepe.pl)' }
	};
	scraperInstance.timers = {
		second: 1000,
		minute: 1000*60,
		hour: 	1000*60*60,
		day: 	1000*60*60*24,
		month: 	1000*60*60*24*30
	};

	scraperInstance.start = function(){
		this.interval = setInterval(this.intervalFunction.bind(this), this.timers.hour / this.webs_array.length );
		// this.intervalFunction();
		// this.intervalFunction();
		// this.intervalFunction();
		return this.interval;
	};

	scraperInstance.stop = function(){
		clearInterval(this.interval);
	};

	scraperInstance.intervalFunction = function(){
		console.log( this.colors.cyan('intervalFunction running at: ' + new Date().toString() ) );

		this.webs_interation = (this.webs_interation+1) %this.webs_array.length;

		console.log( this.colors.cyan('url: ' + this.webs_array[ this.webs_interation ] ) );

		this.request_options.url = this.webs_array[ this.webs_interation ];
		this.request( this.request_options, this.requestCallback.bind(this) );
	};
	scraperInstance.requestCallback = function(err, res, body) {
		if(!err && res.statusCode == 200 && res.headers['content-type'].indexOf('json') > -1){
			results = JSON.parse(body);
			var that = this;
			results.data.children.forEach( function(eachChild){
				this.handleData(eachChild.data);
			}.bind(this));

			// for(var i=0; i < results.data.children.length; i++){
			// 		this.handleData(results.data.children[i].data);
			// }
		}else{
			console.error(err);
			console.error(body);
		}
	};

	scraperInstance.handleData = function (p_data){
		if( !p_data.is_self && !p_data.stickied && p_data.score > 20 ){
			data_url = this.parseUrl(p_data.url);

			switch(data_url.switcher) {
				case 0:
					// console.log( this.colors.magenta('Adding object: ' + JSON.stringify(p_data) ) );
					//dodac zwykly direct obrazek
					this.postDataIntoDpd(p_data, data_url, false);
					break;
				//
				case 1:
					//dodane przez specyficzna funkcje
					break;
				//
				case 2:
					//unable to work with
					break;
				//
				case 3:
					//unknown url, log to other urls
					// console.log(p_data, {url: 'unknown'}, true);
					this.postDataIntoDpd(p_data, {url: 'unknown'}, true);
					break;
				//
				case 4:
					//youtube?
					break;
				//unknown switch state
				default:
					// console.log(data_url);
					console.log('Unknown switch');
			}

			// if( typeof data_url == "string" ){
			// 	// console.log( this.colors.magenta('Adding object: ' + JSON.stringify(p_data) ) )
			// 	// dpdic.adviceanimals.post( { imgurl : data_url, title: p_data_title } , resultErrorConsole);
			// }else if ( data_url == true && typeof data_url == "boolean"){
			// 	//data_url
			// }else{
			// 	console.log( this.colors.red('Unknown url: ' + p_data.url) );
			// 	// dpdic.unknownurl.post( { url: p_data_url } , resultErrorConsole)
			// }
		}
	};

	scraperInstance.postDataIntoDpd = function(p_data, data_url, unknown_flag){
		// this.dpd_ic.webs.post(post_obj, this.resultErrorConsole);
		this.dpd_ic.handler.post(
				'vWRATWGHrqfLqUHybCW3ca6v',
				{ unknown: unknown_flag, title: p_data.title,  url: data_url.url, origin: p_data.subreddit, sourceurl: 'http://reddit.com' + p_data.permalink },
				this.resultErrorConsole
		);
	};

	scraperInstance.resultErrorConsole = function(result, error){
		// if(result) console.log( colors.yellow('Added new: ' + result.imgurl.toString()) );
		if(error)
				if( error.message.toString().indexOf("duplicate url") < 0 )
						console.error( colors.red( error.toString() ) );
	};

	scraperInstance.parseUrl = function(p_url){
		if(p_url.match(/\.(jpeg|jpg|gif|png)$/) !== null){
			//if direct link, no parsing needed
			return { switcher: 0, url: p_url };
		}else if(p_url.indexOf('imgur.com/') > -1){
			if(p_url.match(/\.(webm|gifv)$/) !== null){
				//if new format from imgur then change to old
				return { switcher: 0, url: p_url.substring( p_url.lastIndexOf(".")+1 , 0 ) + 'gif' } ;
			}else if(p_url.indexOf('i.imgur.com') > -1){
				//if linking to direct image from imgur, return url
				return { switcher: 0, url: p_url };
			}else if(p_url.indexOf('imgur.com/a/') > -1){
				//additional request is needed for albums
				//this.getImgurAlbum(p_url);
				return { switcher: 1 };
			}else{
				//just fake it
				return { switcher: 0, url: p_url.replace('imgur.com','i.imgur.com')+'.jpg' };
			}
		}else if(p_url.indexOf('livememe.com/') > -1){
			return { switcher: 0, url: 'http://i.lvme.me/' + p_url.substring(p_url.indexOf('livememe.com/')+13) + '.jpg' };
		}else if(p_url.indexOf('imgflip.com/') > -1){
			if(p_url.indexOf('#') > -1){
				return {switcher: 0, url:'https://i.imgflip.com/'+p_url.substring(p_url.indexOf('imgflip.com/i/')+14, p_url.indexOf('#'))+'.jpg'};
			}else{
				return { switcher: 0, url: 'https://i.imgflip.com/' + p_url.substring( p_url.indexOf('imgflip.com/i/')+14) + '.jpg'};
			}
		}else if(p_url.indexOf('makeameme.org/meme/') > -1){
			return { switcher: 0, url: 'http://makeameme.org/media/created/' + p_url.substring(p_url.indexOf('makeameme.org/meme/')+19) + '.jpg'};
		}else if(p_url.indexOf('gfycat.com/') > -1){
			// this.getDirectGfycat(p_url);
			return { switcher: 1 };
		}else if(p_url.indexOf('gifyoutube.com/') > -1){
			//this website doesnt event work
			return { switcher: 2 };
		}else if(p_url.indexOf('www.flickr.com/') > -1){
			//not a chance, maybe api?
			return { switcher: 2 };
		}else if( p_url.match(/(http:\/\/|https:\/\/)[www\.](youtube.com\/|youtu.be)/) ){
			return { switcher: 4 };
		}

		return { switcher: 3 };
	};
	scraperInstance.getImgurAlbum = function (p_imgur_album_url){
		// jest albumem
		// urlGetJson(https://api.imgur.com/3/album/hMBK4, callback)
		// callback(x){ return x.data.cover }
	};

	scraperInstance.getDirectGfycat = function (p_gfycat_url){
		// http://gfycat.com/cajax/get/ScaryGrizzledComet
		// {"gfyItem":{"gfyId":"scarygrizzledcomet","gfyName":"ScaryGrizzledComet","gfyNumber":"170977436","userName":"anonymous","width":374,"height":286,"frameRate":1,"numFrames":12,"mp4Url":"http:\/\/zippy.gfycat.com\/ScaryGrizzledComet.webm","webmUrl":"http:\/\/zippy.gfycat.com\/ScaryGrizzledComet.webm","gifUrl":"http:\/\/zippy.gfycat.com\/ScaryGrizzledComet.gif","gifSize":378641,"mp4Size":368876,"webmSize":327469,"createDate":"1384004433","views":"2","title":null,"md5":null,"tags":null,"nsfw":null,"sar":null,"url":null,"source":null,"dynamo":null,"uploadGifName":null}}
	};
	console.log('Scraper instance returned');
	return scraperInstance;
};
