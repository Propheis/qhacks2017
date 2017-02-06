var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/recipes', function(req, res, next) {
	res.render('recipes', { title: 'Recipes' });
});

router.get('/details', function(req, res, next) {
	res.render('details', { title: 'Detail' });
});

router.get('/about', function(req, res, next) {
	res.render('about', { title: 'About' });
});


module.exports = router;
