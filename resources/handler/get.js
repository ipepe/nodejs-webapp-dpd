switch (url){
    case '/memes':
        console.log('/memes called');
        query = {
            category: { $in: ['AdviceAnimals'] },
            $sort: {timestamp: -1}
        }
        if(query.page){
            query["$skip"] = query.page*10;
            query["$limit"] = 10;
        }
        dpd.webs.get({
            category: { $in: ['AdviceAnimals'] },
            $sort: {timestamp: -1},
            $skip: ,
            $limit: 10
        }, function(result, error){
            setResult({error: error, result: result});
        });
        break;
    default:
        console.log('UNKNOWN URL CALLED HANDLER!');
        cancel('unknown');
}
