const async = require('async');
const express = require('express');
const router = express.Router();

const Product = require('../models/Product');
const Cart = require('../models/Cart');

const { ensureAuthenticated,checkLogin } = require('../helpers/auth');

const stripe = require('stripe')('sk_test_YkwG8YiVfVJQrDzJNTco2ou0');


function paginate(req,res) {
	const perPage = 9;
		const page = req.params.page;
		Product.find()
			.skip( perPage * page )
			.limit( perPage )
			.populate('category')
			.then(products => {
				Product.count()
					.then(count => {
						res.render('main/product-main',{
							products: products,
							pages: count / perPage
						})
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
}


router.get('/',(req,res)=>{
	if(req.user){
		if(req.user.isAdmin != 1){
			paginate(req,res);
		}else if(req.user.isAdmin == 1){
			res.render('admin/admin-main');
		}
	}else{
		res.render('main/home');
	}
});

router.get('/page/:page',(req,res) => {
	paginate(req,res)
});


router.get('/about',(req,res)=>{
	res.render('main/about');
});


router.get('/products/:id',(req,res,next) => {
	Product.find({ category: req.params.id })
		.populate('category')
		.then(products => {
			res.render('main/category',{
				products: products
			});

		})
		.catch(err => console.log(err));
});


router.get('/product/:id',(req,res,next) => {
	Product.findOne({ _id : req.params.id })
		.then(product => {
			res.render('main/product',{
				product: product
			});

		})
		.catch(err => console.log(err));
});



router.post('/search',(req,res,next) => {
	const search = req.body.q;
	Product.find({ 'name' : { '$regex' : search, '$options' : 'i' } })
		.then(products => {
			res.render('main/search-result',{
				products: products,
				search : search
			});

		})
		.catch(err => console.log(err));
});

router.get('/search',(req,res,next) => {
	res.render('main/home');
});


router.post('/product/:product_id',ensureAuthenticated,(req,res,next) => {
	Cart.findOne({ owner: req.user._id})
		.then(cart => {
			cart.items.push({
				item: req.body.product_id,
				price: parseFloat(req.body.priceValue),
				quantity: parseInt(req.body.quantity),
			});
			cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);
			cart.save()
				.then(cart => {
					return res.redirect('/cart');
				})
				.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
});

router.get('/cart',ensureAuthenticated,(req,res,next) => {
	Cart.findOne( { owner: req.user._id} )
		.populate('items.item')
		.then(cart => {
			res.render('main/cart',{
				foundCart: cart,
				message: req.flash('remove')
			});
		})
		.catch(err => console.log(err));
});

router.post('/remove',ensureAuthenticated,(req,res) => {
	Cart.findOne( { owner: req.user._id} )
		.then(cart => {
			cart.items.pull(String(req.body.item));
			cart.total = (cart.total - parseFloat(req.body.price)).toFixed(2);
			cart.save()
				.then(cart => {
					req.flash('remove','SuccessFully Removed');
					res.redirect('/cart');
				})
				.catch(err => console.log(err));
		})
		.catch(err => console.log(err))
})


router.post('/payment',ensureAuthenticated,(req,res) => {
	const stripeToken = req.body.stripeToken;
	const currentCharges = Math.round(req.body.stripeMoney * 100);
	stripe.customers.create({
		source: stripeToken
	}).then(customer => {
		return stripe.charges.create({
		  	amount: currentCharges,
		  	currency: 'usd',
		  	customer: customer.id
		});
	}).then((charge) => {
		Cart.findOne( { owner: req.user._id} )
			.then(cart => {
				User.findOne({ _id: req.user._id})
					.then(user => {
						if(user){
							console.log(cart.items.length);
							for (var i = 0; i < cart.items.length; i++) {
								user.history.push({
									item: cart.items[i].item,
									paid: cart.items[i].price
								})
							}
							user.save()
								.then(user => {
									Cart.updateOne( { owner: req.user._id},{$set: {items:[],total:0} } )
										.then(updateCart => {
											res.redirect('/users/profile');
										})
										.catch(err => console.log(err));
								})
								.catch(err => console.log(err));
						}
					})
					.catch(err => console.log(err));
			})
			.catch(err => console.log(err));
	})

});


module.exports = router;
