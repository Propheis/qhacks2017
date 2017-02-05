function RecipeViewModel() {
	var self = this;
	self.recipes = ko.observableArray([]);
	self.searchText = ko.observable("");
	self.keywordList = ko.computed(function(){
		return self.searchText().split(" ");
	});
	self.searchRecipes = function (Recipe){

			$.post("/api/recipes", {'': self.keywordList()}, function (infoList){
				self.recipes(infoList);
				console.log("Recipes added");
			})
			.fail(function(err) {
				console.log(err);
			});
	};
}
var viewModel = new RecipeViewModel();
ko.applyBindings(viewModel);
$(document).ready(function(){
	$("#searchBar").focus();
});