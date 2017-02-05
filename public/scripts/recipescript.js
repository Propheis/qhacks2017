function RecipeViewModel() {
	var self = this;
	self.recipes = ko.observableArray([]);
	self.searchText = ko.observable("");
	self.keywordList = ko.computed(function(){
		return self.searchText().split(" ");
	});
	self.isSearching = false;

	self.searchRecipes = function (Recipe){
			self.isSearching = true;
			$.post("/api/recipes", {'': self.keywordList()}, function (infoList){
				self.recipes(infoList);
				console.log("Recipes added");
				self.isSearching = false;
			})
			.fail(function(err) {
				console.log(err);
			});
	};
}
function getRecipe(recipeList, itemUrl){
	var targetRecipe;
	recipeList.forEach(function (listing){
		if (listing.recipe.url === itemUrl){
			targetRecipe = listing;
		}
	});
	return targetRecipe;
}
function onListingClick(event){
	var itemUrl = $(event.currentTarget).data("item-url");
	console.log(itemUrl);
	var recipe = getRecipe(viewModel.recipes(), itemUrl);
	localStorage.setItem('recipe', JSON.stringify(recipe.recipe));
	document.location.pathname="/details";
}
var viewModel = new RecipeViewModel();
ko.applyBindings(viewModel);
$(document).keypress(function(e){
    if (e.which == 13 && viewModel.isSearching == false){
        $("#searchBtn").click();
    }
});
$(document).ready(function(){
	$("#searchBar").focus();
	$(document).on("click", ".listing h1", onListingClick);
});