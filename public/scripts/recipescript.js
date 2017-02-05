function RecipeViewModel() {
	var self = this;
	self.recipes = ko.observableArray([])
	self.init = function (Recipe){
		
		$.get("/api/items", null, function (itemsList){
			var keywordList = [];
			itemsList.forEach(function (item){
				keywordList.push(item.displayName);
			});
			$.post("/api/recipes", {'': keywordList}, function (infoList){
				self.recipes(infoList);
				console.log("Recipes added");
			})
			.fail(function(err) {
				console.log(err);
			});
		});
	};
};

var viewModel = new RecipeViewModel();
ko.applyBindings(viewModel);
viewModel.init();