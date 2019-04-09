const validateCreateProductMiddleware = (req,res,next) => {
	if(!req.file || !req.body.name || !req.body.price || !req.body.category){
		req.flash('errors','Please Fill All The Field..');
		return res.redirect('/admin/add-product');
	}
	next();
};


module.exports = validateCreateProductMiddleware;
