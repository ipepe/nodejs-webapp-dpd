switch (url){
    case '/memes':
        console.log('/memes called');
        dpd.webs.get({origin: 'AdviceAnimals'}, function(result, error){
            setResult({error: error, result: result})
        });
        break;
        
    default:
        console.log('UNKNOWN URL CALLED HANDLER!')
        cancel('unknown');
}