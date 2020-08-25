const passport = require('passport');
const User = require('../models/users');
const LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

//User SignUp

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},function(req, email, password, done) {
    req.checkBody('email', 'Check Email').notEmpty().isEmail();
    req.checkBody('password', 'Password must be at least 6 characters').notEmpty().isLength({min:6});
    const errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash( 'error', messages));
    }

    User.findOne({'email': email}, function(err,user){
        if (err){
            return done(err);
        }
        if (user){
            return done(null, false, {message: 'Email is already in use.'});
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if (err){
                return done(err);
            }
            return done(null, newUser);
        })
    });

}));

//user SignIn

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Check Email').notEmpty().isEmail();
    req.checkBody('password', 'Password must be at least 6 characters').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No user found.'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Please check password'});
        }
        return done(null, user);
    });
}));

//update password



// User.findOne({ username: req.user.username })
// .then((u) => {
//     u.setPassword(req.body.newPassword,(err, u) => {
//         if (err) return next(err);
//         u.save();
//         res.status(200).json({ message: 'password change successful' });
//     });

// })