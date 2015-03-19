// ==================== Load/start dependencies
var deployd_setup = require('./start_script.js');
var deployd_instance = deployd_setup(deploydStartedCallback);
var colors = deployd_instance.colors;

var scraper_def = require('./scraper.js');

// ==================== Scraper code

function deploydStartedCallback(){
	var pages_array = [
		'http://reddit.com/.json',
		'http://reddit.com/r/funny.json',
		'http://reddit.com/r/AdviceAnimals.json'
	];

	var scraper_instance = scraper_def(deployd_instance.dpd_ic, colors, pages_array );

	// scraper_instance.login("scraper","scraper");
	scraper_instance.start();
}
