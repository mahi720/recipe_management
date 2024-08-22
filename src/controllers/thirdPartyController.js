const thirdPartyService = require('../services/thirdPartyService')
const validationHelper = require('../helpers/validation')
const app_constants = require('../constants/app.json')


exports.getRecipe = async (req, res) => {
    try {
        const required_fields = ['ingredients']
        const validation = validationHelper.validation(required_fields, req.query)
        if (Object.keys(validation).length) {
            return res.json({ success: 0, status: app_constants.BAD_REQUEST, message: validation, result: {} })
        }

     

        const recipe_list = await thirdPartyService.getRecipe(req.query)
        return res.json(recipe_list)
    }

    catch (ex) {
        console.log(ex);
    }
}

exports.likeRecipe = async (req, res) => {
    try {
        const required_fields = ['id']
        const validation = validationHelper.validation(required_fields, req.body)

        if (Object.keys(validation).length) {
            return res.json({ success: 0, status: app_constants.BAD_REQUEST, message: validation, result: {} })
        }

        const recipe_like = await thirdPartyService.likeRecipe(req.body,req.user)
        return res.json(recipe_like)
    }

    catch (ex) {
        console.log(ex);
    }
}

exports.favoriteRecipe = async (req, res) => {
    try {
        const required_fields = ['id']

        const validation = validationHelper.validation(required_fields, req.body)

        if (Object.keys(validation).length) {
            return res.json({ success: 0, status: app_constants.BAD_REQUEST, message: validation, result: {} })
        }

        const favorite_recipe = await thirdPartyService.favoriteRecipe(req.body,req.user)
        return res.json(favorite_recipe)
    }

    catch (ex) {
        console.log(ex);
    }
}

exports.getfavoriteList = async (req, res) => {
    try {
        const favorite_list = await thirdPartyService.getfavoriteList(req.query ,req.user)
        return res.json(favorite_list)
    }
    catch (ex) {
        console.log(ex);
    }
}