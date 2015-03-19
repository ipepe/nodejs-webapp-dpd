dpd.unknowns.get({url: this.url}, function(r,e){
   if(r.length > 0){
       cancel('duplicate url');
   } 
});