const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create Schema
const CartSchema = new Schema({
  owner: {
	type: Schema.Types.ObjectId,
	ref: 'user'
  },
  total:{
    type: Number,
    default: 0
   },
  items: [{
  	item:  { type: Schema.Types.ObjectId,ref: 'product'},
  	quantity:{ type: Number, default: 1 },
  	price:{ type: Number, default: 0 },
  }],
  date:{
    type: Date,
    default: Date.now
  }
});


module.exports = Cart = mongoose.model('cart',CartSchema);
