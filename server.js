// ==================== Load/start dependencies
var deployd_setup = require('./start_script.js');
var deployd_instance = deployd_setup(deploydStartedCallback);
var colors = deployd_instance.colors;

var scraper_def = require('./scraper.js');

// ==================== Scraper code

function deploydStartedCallback(){
	var pages_array = [
		'http://www.reddit.com/r/AdviceAnimals/top/.json?sort=top&t=all&limit=100',
		'http://www.reddit.com/r/AdviceAnimals/top/.json?sort=top&t=week',
		'http://www.reddit.com/r/AdviceAnimals/top/.json?sort=top&t=day'
	];

	var scraper_instance = scraper_def(deployd_instance.dpd_ic, colors, pages_array );

	scraper_instance.start();
}
