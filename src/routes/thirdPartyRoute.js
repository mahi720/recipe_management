const express = require('express')
const thirdpartyRoute = express.Router();
const middleware = require("../middlewares/authMiddleware");
const thirdPartyController = require('../controllers/thirdPartyController')


thirdpartyRoute.get('/recipes',middleware.verifyToken, thirdPartyController.getRecipe);

// recipe like ans unlike handle in one api
thirdpartyRoute.post('/like',middleware.verifyToken, thirdPartyController.likeRecipe);

// add favorite and unfavorites in one api
thirdpartyRoute.post('/favorite',middleware.verifyToken, thirdPartyController.favoriteRecipe);

// fetch list of favorite 
thirdpartyRoute.get('/favorite_list',middleware.verifyToken, thirdPartyController.getfavoriteList);



module.exports = thirdpartyRoute;