// ==================== Load/start dependencies
var deployd_setup = require('dpd-openshift-start-script');
var deployd_instance = deployd_setup();
var colors = deployd_instance.colors;

var scraper_def = require('./scraper.js');

// ==================== Scraper code
var pages_array = ['http://reddit.com/.json','http://reddit.com/r/funny.json'];

var scraper_instance = scraper_def(deployd_instance.dpd_ic, colors, pages_array );

scraper_instance.start();