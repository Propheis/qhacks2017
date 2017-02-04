var express = require('express');
var router = express.Router()
  , dbService = require('./dbService')
  , bodyParser = require('body-parser')
  , jsonParser = bodyParser.json();

function isGuid(input) {
  var re = /[0-9A-Za-z]{8}-[0-9A-Za-z]{4}-4[0-9A-Za-z]{3}-[89ABab][0-9A-Za-z]{3}-[0-9A-Za-z]{12}/;
  return re.test(input);
}

router.get('/items', function(req, res, next) {
  dbService.getItems(function(err, items) {
    if (err) {
      console.log("Accessing the db failed");
      res.sendStatus(500);
      return;
    }
    res.json(items);
  });
});

router.get('/items/:id', function(req, res, next) {
  if ( !isGuid(req.params["id"]) ) {
    res.sendStatus(400);
    return;
  }

  dbService.getItem(req.params.id, function(err, item) {
    if (err) {
      console.log("Accessing the db failed");
      res.sendStatus(500);
      return;
    }
    res.json(item);
  });
});

router.post('/items', jsonParser, function(req, res, next) {
  dbService.updateItem(req.body, function(err, item) {
    if (err) {
      console.log("Creating the item failed");
      res.sendStatus(500);
      return;
    }
    res.json(item);
  });
});

router.post('/items/:id', jsonParser, function(req, res, next) {
  if ( !isGuid(req.params["id"]) ) {
    res.sendStatus(400);
    return;
  }

  dbService.updateItem(req.body, function(err, item) {
    if (err) {
      console.log("Could not update the item");
      res.sendStatus(500);
      return;
    }

    res.json(item);
  });
});

router.delete('/items/:id', function(req, res, next) {
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

module.exports = router;
