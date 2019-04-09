const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create Schema
const ProductSchema = new Schema({
  category: {
	type: Schema.Types.ObjectId,
	ref: 'category'
  },
  name:{
    type: String,
   },
  price: {
  	type: String
  },
  image: {
  	type: String
  },
  date:{
    type: Date,
    default: Date.now
  }
});


module.exports = Product = mongoose.model('product',ProductSchema);
