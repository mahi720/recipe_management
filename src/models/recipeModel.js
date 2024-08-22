const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String },
  amount: { type: String },
  unit: { type: String }
});

const recipeSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String },
  image_url: { type: String },
  ingredients: [ingredientSchema], 
  instructions: { type: String },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "user", default: [] }]
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
