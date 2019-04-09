const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require("./Product");


//Create Schema
const CategorySchema = new Schema({
  name:{
    type: String,
    unique: [true,'Please Provide Unique Name'],
    required: [true,'Please Provide A Category Name']
   },
  date:{
    type: Date,
    default: Date.now
  }
});

CategorySchema.pre('deleteOne', function(next) {
    category = this;

    Product.deleteMany({category: category._conditions._id}).exec();

    next();

});

module.exports = Category = mongoose.model('category',CategorySchema);
