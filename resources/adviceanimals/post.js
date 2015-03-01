dpd.adviceanimals.get( {imgurl: this.imgurl}, function(result){
    if(result.length > 0) cancel('duplicate imgurl');
});
this.timeCreated = Date.now();