const guid = require('uuid/v4');
var ItemProvider = require('./ItemProvider')
, Config = require('../Config')
, nano = require('nano')(Config.dbUrl)
, items = nano.use('items');


/**
 * Fetches all items in the database
 * @param {callback:Function(err, data)} - The callback for when the data becomes avavilable.
 */
function getItems(callback) {
  items.list({
    include_docs: true
  }, function(err, body) {
    if (err) {
      console.log(err);
      return;
    }
    var docs = [];

    body.rows.forEach(function(row) {
      docs.push(row.doc);
    });

    callback(null, docs);
  })
}

/**
 * Updates an item in the db. Callback is returned the item
 * If item's id is not provided/found it will create a new item
 * @param (item: Item) - The item to add/update
 * @param (callback: Function) - A callback of form (err, Item). If err is defined, then an error has occured.
 */
function updateItem(item, callback) {
  var updateDone = function(err) {
    if (!err)
      getItem(item._id, callback);
    else
      callback(err);
  };

  if (!item._id) {
    item._id = guid();
    delete item._rev;
    items.insert(item, {include_docs: true}, updateDone);
  }
  else {
    items.get(item._id, function(err, newItem) {
      if (err) {
        callback(err, null);
        return;
      }

      items.insert(item, {include_docs: true}, updateDone);
    });
  }
}

/**
 * Delete's the specified item from the db
 * @param {itemId:Guid} - the ID of the item
 * @param (callback: Function) - A callback of form (err). If err is defined, then an error has occured.
 */
function deleteItem(itemId, callback) {
  getItem(itemId, function(err, item) {
    if (err) {
      console.log(err);
      callback(err);
    }

    items.destroy(item._id, item._rev, callback);
  });
}

/**
 * Finds an item in the database. Returns the item or null if not found
 * @param {callback: Function} - Callback of (err, data) when lookup is done
 * @param {itemId:Guid} - The id of the item
 */
function getItem(itemId, callback) {
  items.get(itemId, {include_docs: true}, callback);
}


/**
 * Recreates db and fills it with data
 */
function reSeedDatabase(cb) {
  var data = {docs: _getDatabase().items};
  nano.db.destroy('items',function(){
    nano.db.create('items', function() {
      db = nano.use('items');
      db.bulk(data, null, function(err, res) {
        if (err) {
          console.log("Seeding the database failed. Dumping the error");
          console.log(err);
          cb(err);
        }
        else {
          console.log("Finished seeding the database");
          cb(null);
        }
      });
    });
  });
}

/**
 * Create a new Item instance
 * @param {displayName:String} - The friendly name of the item
 * @param {percentRemaining:Integer} - The percent remaining. Between 0 and 100p
 * @param {knownAliases:String[]} - An array of other known names for this item
 */
function Item(displayName, percentRemaining, knownAliases) {
  var self = this;

  self.displayName = displayName;
  self.percentRemaining = percentRemaining;
  self.knownAliases = knownAliases;
  self._id = guid();

  return self;
}

/**
 * Internal function to create a sample database
 */
function _getDatabase() {
  var foods = [
  "Apple Juice",
  "Potato Chips",
  "Baby Spinach",
  "Frozen French Fries",
  "2% Milk",
  "Eggs",
  "Cheddar Cheese",
  "White Bread"
  ];

  var receiptNames = [
  "ALLEN JUICE",
  "SELECTION CHIP",
  "BABY SPINACH",
  "SELECTION FRIES",
  "PARMALAT 2% MILK",
  "SELECT.EGG",
  "SEL.CHEESE BLOCK",
  "ENRICHED WHITE BREAD"
  ];

  var db = { items: [] };

  // Create the items
  for (var i = 0; i < foods.length; i++) 
      // Create item with percent remaining in [0,100]
    db.items.push( new Item( foods[i], Math.floor(Math.random()*101), [ receiptNames[i] ] ) );
    db.items[0]._id = "9d1f7c1f-823c-49e9-a394-d77f9421f578";
    return db;
  }

module.exports = {
  getItem: getItem,
  getItems: getItems,
  updateItem: updateItem,
  deleteItem: deleteItem,
  reSeedDatabase: reSeedDatabase
};