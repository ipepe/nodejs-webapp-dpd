switch (url){
    case '/memes':
        sub_query = {
            origin: { $in: ['AdviceAnimals'] },
            $sort: {timestamp: -1}
        };
        if(query.page > 0){
            sub_query["$skip"] = query.page*10;
        }
        sub_query["$limit"] = 10;
        dpd.webs.get(sub_query, function(result, error){
            setResult({error: error, result: result});
        });
        break;
      case '/haff':
          sub_query = {
              origin: { $in: ['AdviceAnimals'] },
              $sort: {timestamp: -1}
          };
          if(query.page > 0){
              sub_query["$skip"] = query.page*10;
          }
          sub_query["$limit"] = 10;
          dpd.webs.get(sub_query, function(result, error){
              setResult({error: error, result: result});
          });
          break;
    default:
        console.log('UNKNOWN URL CALLED HANDLER!');
        cancel('unknown');
}
