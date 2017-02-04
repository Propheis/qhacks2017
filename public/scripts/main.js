function Food(displayName, percentRemaining, knownAliases, isGone) {
	var self = this;
	self.isGone = ko.observable(isGone);
	self.displayName = ko.observable(displayName);
  	self.percentRemaining = ko.observable(percentRemaining);
  	self.knownAliases = ko.observableArray(knownAliases);
}
function GroceryViewModel() {
	var self = this;
	self.items = ko.observableArray([]);
	self.newItem = ko.observable();

	self.addItem = function (Food) {
		$.post("api/items", newItem, function (item) {
			self.items.push(Food);
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
				var food = new Food(item.displayName, item.percentRemaining, item.knownAliases, false);
				self.items.push(food);
			});
			console.log("itemList loaded")
		});
	};

};

var viewModel = new GroceryViewModel();
ko.applyBindings(viewModel);
viewModel.startup();

