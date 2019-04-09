const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const async = require('async');

const { ensureAuthenticated,checkLogin } = require('../helpers/auth');

const User = require('../models/User');

const Cart = require('../models/Cart');


router.get('/login',checkLogin,(req,res) => {
	if(req.user) return res.redirect('/');
	res.render('accounts/login',{
		message : req.flash('loginMessage')
	})
})

router.get('/profile',ensureAuthenticated,(req,res) => {
	User.findOne({ _id: req.user._id })
		.populate('history.item')
		.then(user => {
			res.render('accounts/profile',{
				user: user,
				message: req.flash('success'),
				message: req.flash('warning')
			})
		})
		.catch(err => console.log(err));
})


router.post('/login',checkLogin, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/users/profile',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});



router.get('/signup',checkLogin,(req,res) => {
	res.render('accounts/signup',{
		errors : req.flash('errors')
	});
});


router.post('/signup',checkLogin,(req,res,next) => {

	async.waterfall([
		(callback) => {
			const  user = new User()

			user.profile.name = req.body.name;
			user.email = req.body.email;
			user.password = req.body.password;
			user.profile.picture = user.gravatar();

			User.findOne({ email : req.body.email })
				.then(foundUser => {
					if(foundUser){
						console.log(`${req.body.email} Already exists`);
						req.flash('errors','Account with email address already exists');
						return res.redirect('/users/signup');
					}else{

							user.save()
							.then(user => {
								callback(null , user);
							})
							.catch(err => console.log(err));
					}
				})
				.catch(err => console.log(err));
		},

		(user,callback) => {
			console.log(user);
			const cart = new Cart();
			cart.owner = user._id;
			cart.save()
				.then(cart => {
					req.flash('success','Registration SuccessFully Done');
					req.logIn(user,(err) => {
						if (err) return next(err);
						res.redirect('/users/profile');
					})
				})
				.catch(err => console.log(err));
		}
	]);



});


router.get('/logout',ensureAuthenticated,(req,res,next) => {
	req.logout();
	res.redirect('/');
});

router.get('/edit-profile',ensureAuthenticated,(req,res) => {
	res.render('accounts/edit-profile',{
		message: req.flash('success')
	})
});

router.post('/edit-profile',ensureAuthenticated,(req,res) => {
	User.findOne({ _id: req.user._id })
		.then(user => {
			if(req.body.name) user.profile.name = req.body.name;
			if(req.body.address) user.address = req.body.address;
			user.save()
				.then(user => {
					req.flash('success','SuccessFully Edited Your Profile');
					res.redirect('/users/edit-profile');
				})
				.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
});


module.exports = router;
