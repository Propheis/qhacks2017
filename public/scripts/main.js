function Food(displayName, percentRemaining, knownAliases, id, rev) {
	var self = this;
	self.displayName = ko.observable(displayName);
	self.percentRemaining = ko.observable(percentRemaining);
	self.knownAliases = ko.observableArray(knownAliases);
	self._id = ko.observable(id);
	self._rev = ko.observable(rev);

	self.withoutObservables = function() {
		return {
			displayName: self.displayName(),
			percentRemaining: self.percentRemaining(),
			knownAliases: self.knownAliases(),
			_id: self._id(),
			_rev: self._rev()
		};
	}
}

function GroceryViewModel() {
	var self = this;
	self.items = ko.observableArray([]);
	self.newItem = ko.observable("");

	self.addItem = function () {
		var newFood = new Food(self.newItem(), 100, []);
		newFood._id = newFood._id();
		newFood._rev = newFood._rev();
		$.post("api/items", newFood, function (item) {
			self.items.push(new Food (item.displayName, item.percentRemaining, item.knownAliases, item._id, item._rev));
			console.log("Item added to server");
		});
	};
	self.removeItem = function(item) { 
		$.ajax("/api/items/" + item.id, {
			method: "DELETE"
		});
		self.items.destroy(item); 
		console.log("Item deleted");
	};
	self.startup = function (){
		$("#addFood").focus();
		$.get("/api/items", null, function (itemList){
			itemList.forEach(function(item){
				var food = new Food(item.displayName, item.percentRemaining, item.knownAliases, item._id, item._rev);
				self.items.push(food);
			});
			console.log("itemList loaded")
		});
	};
}

/**
 * Update the specified item on the server
 * @param {itemId:GUID} - The id of the item to update
 */
function updateItem(itemId) {
	// Find the item
	var updatedItem;
	viewModel.items().forEach(function(item) {
		if (item._id() === itemId)
			updatedItem = item;
	});

	if (!updatedItem) {
		console.log("Item was not found");
		return;
	}

	// Prep item to update
	updatedItem = updatedItem.withoutObservables();

	// Post to the server
	$.post('/api/items/', updatedItem)
	.fail(function(err){
		console.log("Failed to push updated item to the server");
		console.log(err);
	});
}

function onSliderChanged(e) {
	var itemId = $(e.currentTarget).data('item-id');
	updateItem(itemId);
}

var viewModel = new GroceryViewModel();
ko.applyBindings(viewModel);
viewModel.startup();
$(document).keypress(function(e){
    if (e.which == 13){
        $("#addBtn").click();
    }
});

$(document).on('change', '.percentSlider', onSliderChanged);
