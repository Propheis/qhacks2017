function getRecipeFromStorage() {
	try {
		return JSON.parse(localStorage.getItem('recipe'));
		localStorage.clear();
	} catch(e) {
		console.log("Recipe was not a valid JSON object");
	}
}

function SingleViewModel(){
	var self = this;
	self.currentRecipe = getRecipeFromStorage();   
};
var viewModel = new SingleViewModel();
ko.applyBindings(viewModel);