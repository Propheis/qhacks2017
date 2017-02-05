var express = require('express');
var router = express.Router()
  , Edamam = require('../services/Edamam')
  , dbService = require('../services/dbService')
  , bodyParser = require('body-parser')
  , jsonParser = bodyParser.json();

function isGuid(input) {
  var re = /[0-9A-Za-z]{8}-[0-9A-Za-z]{4}-4[0-9A-Za-z]{3}-[89ABab][0-9A-Za-z]{3}-[0-9A-Za-z]{12}/;
  return re.test(input);
}

router.get('/items', function(req, res) {
  dbService.getItems(function(err, items) {
    if (err) {
      console.log("Accessing the db failed");
      res.sendStatus(500);
      return;
    }
    res.json(items);
  });
});


router.post('/items', jsonParser, function(req, res) {
  dbService.updateItem(req.body, function(err, item) {
    if (err) {
      console.log("Creating the item failed: " + err.reason);
      res.sendStatus(400);
      return;
    }
    res.json(item);
  });
});

router.get('/items/:id', function(req, res) {
  if ( !isGuid(req.params["id"]) ) {
    res.sendStatus(400);
    return;
  }

  dbService.getItem(req.params.id, function(err, item) {
    if (err) {
      res.sendStatus(err.statusCode);
      return;
    }
    res.json(item);
  });
});

router.post('/items', jsonParser, function(req, res) {
  if ( !req.body || !req.body._id || !isGuid(req.body._id) ) {
    res.sendStatus(400);
    return;
  }

  var item = req.body;

  dbService.updateItem(item, function(err, newItem) {
    if (err) {
      console.log("Could not update the item: " + err.reason);
      console.log(err);
      res.sendStatus(500);
    } 
    else {
      console.log("API Sending Response");
      res.json(item);
    }
  });

});

router.delete('/items/:id', function(req, res) {
  if ( !isGuid(req.params["id"]) ) {
    res.sendStatus(400);
    return;
  }
  
  dbService.deleteItem(req.params.id, function(err) {
    if (err) {
      console.log("Could not delete the item");
      res.sendStatus(500);
      return;
    }
    res.json('{ message: "Successfully deleted the item" }');
  });
});

router.post('/recipes', jsonParser, function(req, res) {
  try {
    var keywords = req.body["[]"];
    if (!keywords)
      throw new Error();

    

    Edamam.getRecipeResults(keywords, function(err, results) {
      if (err) {
        console.log(err);
        res.statusCode(500);
      }
      else
        res.json(results);
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

///////////////////////
router.get('/seed', function(req, res){
  dbService.reSeedDatabase(function(err){
    if (err)
      res.json(err);
    res.json('{"status": "Seeded the database"}');
  });
});

module.exports = router;
