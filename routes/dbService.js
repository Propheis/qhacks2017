const guid = require('uuid/v4');
var db = _getDatabase();


/**
 * Fetches all items in the database
 * @param {callback:Function(err, data)} - The callback for when the data becomes avavilable.
 */
function getItems(callback) {
  callback(null, db.items);
}

/**
 * Updates an item in the db. Callback is returned the item
 * If item's id is not provided/found it will create a new item
 * @param (item: Item) - The item to add/update
 * @param (callback: Function) - A callback of form (err, Item). If err is defined, then an error has occured.
 */
function updateItem(item, callback) {
  var verb = "Added";
  if (!item.id) {
    item.id = guid();
    db.items.push(item);
  }
  else {
    deleteItem(item.id);
    db.items.push(item);
    verb = "Updated"
  }

  console.log(verb + " new item \"" + item.displayName + "\" to database");
  callback(null, item)
}

/**
 * Delete's the specified item from the db
 * @param {itemId:Guid} - the ID of the item
 * @param (callback: Function) - A callback of form (err). If err is defined, then an error has occured.
 */
function deleteItem(itemId, callback) {
  for (var i = 0; i < db.items.length; i++) {
    if (db.items[i].id === itemId) {
      // Remove that element from the array
      db.items.splice(i, 1);
      if (callback)
        callback(null);
    }
  }
  if (callback)
    callback(null);
}

/**
 * Finds an item in the database. Returns the item or null if not found
 * @param {callback: Function} - Callback of (err, data) when lookup is done
 * @param {itemId:Guid} - The id of the item
 */
function getItem(itemId, callback) {
  for (var i = 0; i < db.items.length; i++) {
    if (db.items[i].id === itemId)
      callback(null, db.items[i]);
  }
  callback("Could not find the item with ID: " + itemId);
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
  db.items[0].id = "9d1f7c1f-823c-49e9-a394-d77f9421f578";
  return db;
}

/**
 * Create a new Item instance
 * @param {displayName:String} - The friendly name of the item
 * @param {percentRemaining:Integer} - The percent remaining. Between 0 and 100
 * @param {knownAliases:String[]} - An array of other known names for this item
 */
function Item(displayName, percentRemaining, knownAliases) {
  var self = this;

  self.displayName = displayName;
  self.percentRemaining = percentRemaining;
  self.knownAliases = knownAliases;
  self.id = guid();

  return self;
}

module.exports = {
  getItem: getItem,
  getItems: getItems,
  updateItem: updateItem,
  deleteItem: deleteItem
};