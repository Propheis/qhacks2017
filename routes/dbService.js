const guid = require('uuid/v4');

/**
 * Updates an item in the db. 
 * If item's id is not provided/found it will create a new item
 * @param {item:Item} - The item to create/update
 */
function updateItem(item) {
  var verb = "Added";
  if (!item.id) {
    db.items.push(item);
  }
  console.log(verb + " new item \"" + item.displayName + "\" to database");
}

/**
 * Delete's the specified item from the db
 * @param {itemId:Guid} - the ID of the item
 */
function deleteItem(item) {

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
    for (var j = 0; j < receiptNames.length; j++)
      // Create item with percent remaining in [0,100]
      db.items.push( new Item( foods[i], Math.floor(Math.random()*101), [ receiptNames[j] ] ) );
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

  if ( typeof displayName !== "string" 
    || typeof percentRemaining !== "integer" 
    || typeof knownAliases !== "Array")
  {
    console.log("The item just created seems \"weird\". Here's the item:");
    console.log(self);
  } 

  return self;
}

module.exports = {
  updateItem: updateItem,
  deleteItem: deleteItem 
};