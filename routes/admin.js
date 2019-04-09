const express = require('express');
const router = express.Router();
const faker = require('faker');
const fs = require('fs');
const path = require('path');

const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

const multer  = require('multer')
const date = Date.now();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, date +  file.originalname)
  }
})
const upload = multer({ storage: storage })

const validateCreateProductMiddleware  = require('../helpers/createProductValidator');

const { checkAdmin } = require('../helpers/auth');



router.get('/create-admin',(req,res,next) => {
	const user = User();

	user.email = 'mahmudul@gmail.com';
	user.password = '123456';
	user.profile.name = 'admin';
	user.isAdmin = 1;
	user.profile.picture = user.gravatar();

	user.save()
		.then(user => {
			req.logIn(user,(err) => {
				if (err) return next(err);
				res.redirect('/users/profile');
			})
		})
		.catch(err => console.log(err));
});


router.get('/add-category',checkAdmin,(req,res) => {
	res.render('admin/add-category',{
		message: req.flash('success'),
		error_message: req.flash('errors')
	});
});


router.get('/category',(req,res) => {
	Category.find({})
		.then(categories => {
			res.render('admin/category',{
				categories: categories,
				message: req.flash('success'),
			})
		})
		.catch(err => console.log(err));
})


router.post('/add-category',checkAdmin,(req,res) => {
	const category = new Category();
	category.name = req.body.name;

	category.save()
		.then(category => {
			req.flash('success','SuccessFuly Add a Category');
			return res.redirect('/admin/add-category');
		})
		.catch(err => {
			const validationErrors = Object.keys(err.errors).map(key => err.errors[key].message);
	        req.flash('errors',validationErrors);
	        return res.redirect('/admin/add-category');
		});
});


router.delete('/delete/:id',checkAdmin, (req , res) => {
   Category.deleteOne({_id: req.params.id})
    .then(() => {
    	req.flash('success','Category Deleted Successfully..');
    	res.redirect('/admin/category');
    })
});

router.get('/edit-category/:id',checkAdmin,(req,res) => {
	Category.findOne({
   		_id: req.params.id
   	})
   	.then(category => {
	    res.render('admin/edit-category',{
	        category: category,
	        error_message: req.flash('errors')
	    });
   	});
})

router.put('/edit-category/:id',checkAdmin,(req , res) => {
   Category.findOne({
   		_id: req.params.id
   })
   .then(category => {
	   	category.name = req.body.name,
	   	category.save()
	   	.then(category => {
	   		req.flash('success','Category Updated Successfully..');
	   		res.redirect('/admin/category');
	   	});
   })
   .catch(err => console.log(err));
});



router.get('/product',(req,res) => {
	Product.find({})
		.populate('category')
		.then(products => {
			res.render('admin/product',{
				products: products,
				message: req.flash('success')
			})
		})
		.catch(err => console.log(err));
})


router.get('/add-product',checkAdmin,(req,res) => {
	Category.find({})
		.then(categories => {
			res.render('admin/add-product',{
				categories: categories,
				error_message: req.flash('errors'),
				message : req.flash('success')

			});
		})
		.catch(err => console.log(err));
});


router.post('/add-product',upload.single('image'),validateCreateProductMiddleware,checkAdmin,(req,res) => {

	const product = new Product()

	product.category = req.body.category;
	product.name = req.body.name;
	product.price = req.body.price;
	product.image = '/uploads/' + date + req.file.originalname;

	product.save()
		.then(product => {
			req.flash('success','SuccessFuly Add a Prodcut');
			res.redirect('/admin/add-product');
		})
		.catch(err => console.log(err));

});

router.delete('/product-delete/:id',checkAdmin, (req , res) => {
   Product.findOne({_id: req.params.id})
   		.then(product => {
   			uploadDir = path.join(__dirname, '../public')
   			fs.unlinkSync(uploadDir + product.image);
			Product.deleteOne({_id: req.params.id})
			    .then(() => {
			    	req.flash('success','Product Deleted Successfully..');
			    	res.redirect('/admin/product');
			    })
			    .catch(err=>console.log(err));
   		})
   		.catch(err => console.log(err));
});


router.get('/edit-product/:id',checkAdmin,(req,res) => {
	Product.findOne({
   		_id: req.params.id
   	})
   	.then(product => {
		Category.find({})
			.then(categories => {
				res.render('admin/product-edit',{
					product: product,
					categories: categories,
					error_message: req.flash('errors'),
					message : req.flash('success')
				})
			})
			.catch(err => console.log(err));
   	})
   	.catch(err => console.log(err));
})


router.put('/edit-product/:id',upload.single('image'),checkAdmin,(req , res) => {
   Product.findOne({
   		_id: req.params.id
   })
   .then(product => {
		if(!req.file){
			product.category = req.body.category;
			product.name = req.body.name;
			product.price = req.body.price;
			product.save()
				.then(product => {
					req.flash('success','Product Updated Successfully..');
			    	res.redirect('/admin/product');
				})
				.catch(err => console.log(err));
		}else{
			uploadDir = path.join(__dirname, '../public')
   			fs.unlinkSync(uploadDir + product.image);
			product.category = req.body.category;
			product.name = req.body.name;
			product.price = req.body.price;
			product.image = '/uploads/' + date + req.file.originalname;
			product.save()
				.then(product => {
					req.flash('success','Product Updated Successfully..');
			    	res.redirect('/admin/product');
				})
				.catch(err => console.log(err));
		}
   });
});

module.exports = router;
