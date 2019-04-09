## Ecommerce Site With NodeJs,Express,MonogDB,Passport,Ejs


# Features
  1.Admin Panel
  2.Full Authentication System
  3.Onine Stripe Payment System
  4.Users History Panel
  5.Profile Update
  6.Users Shopping Cart System
  7.Live Search Using Ajax
  8.Many More




## Usage

   ### Database
  For Database Connection Please Update database.js in config folder
    if(process.env.NODE_ENV === 'production'){
       module.exports = {
          mongoURI: 'Your Mlab Uri',
       }
      }else{
        module.exports = {
          mongoURI : 'mongodb://localhost:27017/ecomm_dev'
        }
      }

  ### Admin Setup
    Update create-admin route in admin.js in routes folder

    router.get('/create-admin',(req,res,next) => {
    const user = User();

    user.email = 'Your Gmail';
    user.password = 'Your Password';
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

    At Last run this http://localhost:3000/admin/create-admin using postman

  ### Stripe Configure
   Please Update Your Stipe Key in pages.js in routes folder and in cart.js views.


### Installation

Install the dependencies

```sh
$ npm install
```

### Serve
To serve in the browser  -

```sh
$ npm run server
```


## More Info

### Author

Mahmudul Hassan

### Version
1.1.0

### License

This project is licensed under the MIT License
