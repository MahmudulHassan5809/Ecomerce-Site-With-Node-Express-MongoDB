module.exports = {
  ensureAuthenticated: function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('loginMessage', 'Not Authorized');
    res.redirect('/users/login');
  },
  checkLogin: function(req, res , next){
    if(req.isAuthenticated()){
      req.flash('success', 'You Are Already Loggedin..');
      res.redirect('/users/profile');
    }else{
    	return next();
    }
  },
  checkAdmin: function(req, res , next){
    if(req.isAuthenticated() && req.user.isAdmin == 1){
        return next();
      }

    req.flash('warning', 'Not Authorized');
    res.redirect('/users/profile');
  },
}
