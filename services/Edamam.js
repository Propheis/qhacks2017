var https = require('https')
, config = require('../Config');

/**
 * Forms a url to fetch data from the Edamam API
 * @param {keywordList:String[] or String} - The list of recipe keywords to search for or a single string keyword
 * @returns {String} - The well formed url to query Edamam
 */
 function createRequestUrl(keywordList) {
  // Build the query string to search the API
  var queryString = "?app_id=" + config.edamamAPI.app_id +
  "&app_key=" + config.edamamAPI.app_key + 
  "&from=0&to=50&q=";
  // Add our keywords
  if (typeof keywordList === "string") {
    queryString += encodeURIComponent(keywordList);
  } else {
    keywordList.forEach(function(keyword, index) {
      // escape 
      queryString += encodeURIComponent(keyword);

      if (index < keywordList.length - 1)
        queryString += "%2B";
    });
  }

  return queryUrl = "https://api.edamam.com/search" + queryString;
}

/**
 * Fetch a list of recipes from Edamam API
 * @param {keywordList:String[]} - The list of keywords to search for
 * @param {callback:function(err, recipeList)} - If err is defined, shit hit the fan.
 */
function getRecipeResults(keywordList, callback) {
  console.log("Querying Edamam.com...");
  var queryUrl = createRequestUrl(keywordList);
  
  https.get(queryUrl, function(res) {
    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      var searchResults = JSON.parse(body);
      
      console.log("Received response from Edamam.");
      console.log("There are " + searchResults.hits.length + " recipes");

      callback(null, searchResults.hits);
    });

    res.on('error', function(err) {
      cb(err, null);
    });

  });
}


module.exports = {
  getRecipeResults: getRecipeResults
};