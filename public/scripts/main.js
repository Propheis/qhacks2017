function Food(displayName, percentRemaining, knownAliases, id, rev) {
	var self = this;
	self.displayName = ko.observable(displayName);
  	self.percentRemaining = ko.observable(percentRemaining);
  	self.knownAliases = ko.observableArray(knownAliases);
  	self._id = ko.observable(id);
  	self._rev = ko.observable(rev);
}
function GroceryViewModel() {
	var self = this;
	self.items = ko.observableArray([]);
	self.newItem = ko.observable("");


	self.addItem = function () {
		var newFood = new Food(self.newItem(), 100, []);
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
		$.get("/api/items", null, function (itemList){
			itemList.forEach(function(item){
				var food = new Food(item.displayName, item.percentRemaining, item.knownAliases, item._id, item._rev);
				self.items.push(food);
			});
			console.log("itemList loaded")
		});
	};

};

var viewModel = new GroceryViewModel();
ko.applyBindings(viewModel);
viewModel.startup();

