const express = require('express');
const router = express.Router();

const async = require('async');
const faker = require('faker');

const Category = require('../models/Category');
const Product = require('../models/Product');



router.post('/search',(req,res,next) => {
	const search = req.body.q;
	console.log(search);
	Product.find({ 'name' : { '$regex' : search, '$options' : 'i' } })
		.populate('category')
		.then(products => {
			res.json(products);
		})
		.catch(err => console.log(err));
});


router.get('/:name',(req,res,next) => {
	async.waterfall([

		(callback) => {
			Category.findOne({ name: req.params.name })
					.then(category => {
						callback(null,category);
					})
					.catch(err => console.log(err));
		},

		(category,callback) => {
			for (var i = 0; i < 30 ; i++) {
				const product = Product();
				product.category = category._id;
				product.name = faker.commerce.productName();
				product.price = faker.commerce.price();
				product.image = faker.image.image();

				product.save()
					.then(product => {

					})
					.catch(err => console.log(err));
			}
		}

	]);

	res.json({message : 'Success'});
})

module.exports = router;
