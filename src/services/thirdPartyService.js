require("dotenv").config();
const app_helper = require("../helpers/app");
const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");
const app_constants = require("../constants/app.json");
const { Types } = require("mongoose");

exports.getRecipe = async (data) => {
 
  const params = {
    ingredients: data.ingredients,
    number: data.number ? data.number : 5,
  };

  const api_url = 'https://api.spoonacular.com/recipes';

  const recipe_data = await app_helper.makeRequest(api_url, params);

  let result = [];

  if (recipe_data && recipe_data.length > 0) {
    // Loop through the returned recipes and fetch their instructions
    for (const recipe of recipe_data) {
      // Fetch detailed information for each recipe to get instructions
      const detailed_url = `https://api.spoonacular.com/recipes/${recipe.id}/information`;
      const detailed_recipe = await app_helper.makeRequest(detailed_url, { apiKey: process.env.RECIPE_API_KEY });

     const data =  await Recipe.create({
        id: recipe.id,
        title: recipe.title,
        image_url: recipe.image,
        ingredients: recipe.usedIngredients.map((ingredient) => ({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
        })),
        instructions: detailed_recipe.instructions // Add instructions to the schema
      });

      result.push(data);
    }
  } else {
    return {
        success:0,
        status: app_constants.BAD_REQUEST,
        message: "There is no data ",
        result : {}
    }
  }

  return {
    success:1,
    status: app_constants.SUCCESS,
    message: "successfully get data from api",
    result 
  }
};

exports.likeRecipe = async (data,user_data) => {
 
    const {id} = data;
    const {_id} = user_data;

    const recipe_data = await Recipe.findOne({_id:id});
    if(!recipe_data){
        return {
            success:0,
            status: app_constants.BAD_REQUEST,
            message: "There is no recipe availabe!",
            result : {}
        }
    }


    const like_check = recipe_data.likes.includes(_id);

    if (like_check) {
      // now we are going to unlike it
      const filterData = recipe_data.likes.filter((id)=> id.toString() != _id.toString());

      const update_recipe = await Recipe.updateOne({_id: id},{$set:{likes:filterData}});
      if(update_recipe){
        return {
          success: 0,
          status: app_constants.BAD_REQUEST,
          message: "Recipe was liked now it is unlike",
          result: {},
        };
      }
    }
  
    recipe_data.likes.push(_id);
    const update_recipe = await Recipe.updateOne(
      { _id:id },
      { $set: { likes: recipe_data.likes } }
    );
  
    if (update_recipe) {
      return {
        success: 1,
        status: app_constants.SUCCESS,
        message: "recipe Liked successfully",
        result: {},
      };
    }
  
    return {
      success: 0,
      status: app_constants.INTERNAL_SERVER_ERROR,
      message: "internal server error",
      result: {},
    };
};

exports.favoriteRecipe = async (data,user_data) => {
 
    const {id} = data;
    const recipe_data = await Recipe.findOne({_id:id});
    if(!recipe_data){
        return {
            success:0,
            status: app_constants.BAD_REQUEST,
            message: "There is no recipe availabe!",
            result : {}
        }
    }


    const check_favorite = user_data.favorite.includes(id);

    if (check_favorite) {
      // now we are going to unfavorite it
      const filterData = user_data.favorite.filter((recipeId)=> recipeId.toString() != id.toString());

      const update_favorite_list = await User.updateOne({_id: user_data._id},{$set:{favorite:filterData}});
      if(update_favorite_list){
        return {
          success: 0,
          status: app_constants.BAD_REQUEST,
          message: "Recipe was favorite now it is unUnfavorite",
          result: {},
        };
      }
    }
  
    user_data.favorite.push(id);

    const favorite_recipe = await User.updateOne(
      { _id:user_data._id },
      { $set: { favorite:  user_data.favorite } }
    );
  
    if (favorite_recipe) {
      return {
        success: 1,
        status: app_constants.SUCCESS,
        message: "recipe added as favorite successfully",
        result: {},
      };
    }
  
    return {
      success: 0,
      status: app_constants.INTERNAL_SERVER_ERROR,
      message: "internal server error",
      result: {},
    };
};

exports.getfavoriteList = async (data,user_data) => {
    
    const limit = data.limit ? data.limit : 10000;
    const offset = data.offset ? data.offset : 0;
    const search = data.search ? data.search : "";
  
    const mongo_id = new Types.ObjectId(user_data._id);
  
    let search_query = {};
    if (search) {
      const regex = new RegExp(search, 'i')
      search_query['$or'] = [
          { "favorite_details.title": regex }
      ]
    }
  
    const pipeline = [
      { $match: { _id: mongo_id } },
      {
        $lookup: {
            from: 'recipes',
            localField: "favorite",
            foreignField: "_id",
            as: "favorite_details"
        }
    },
    { $unwind: "$favorite_details" },
    { $match: search_query }
    ];
  
    const [result, total_count] = await Promise.all([
      User.aggregate([
        ...pipeline,
        {
            $project: {
                id: 1,
                title: "$favorite_details.title",
                image_url: "$favorite_details.image_url",
            }
        },
        { $skip: +offset },
        { $limit: Number(limit) },
    ]),
    User.aggregate([
        ...pipeline,
        { $count: "total_count" }
    ])
    ]);
  
    console.log(total_count);
    console.log(result);
  
    if (result) {
      return { success: 1, status: app_constants.SUCCESS, message: 'favorite list fetched successfully!', total_count: total_count.length ? total_count[0].total_count : 0, result };
  }
  return { success: 0, status: app_constants.INTERNAL_SERVER_ERROR, message: 'Internal server error!', result: {} }  
};
