const Cart = require('../models/Cart');

module.exports = function(req,res,next){
	if(req.user){
		let total = 0;
		Cart.findOne({ owner: req.user._id })
			.then(cart => {
				if(cart){
					for (var i = 0; i < cart.items.length; i++) {
						total += cart.items[i].quantity;
					}
					res.locals.cart = total;
				}else{
					res.locals.cart = 0;
				}
				next();
			})
			.catch(err => console.log(err));
	}else{
		next();
	}
}
