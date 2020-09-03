const passport = require('passport');
const User = require('../models/users');
const LocalStrategy = require('passport-local').Strategy;


const userDAO = require('../daos/users');


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
    req.checkBody('password', 'Password must be at least 4 characters').notEmpty().isLength({min:4});
    const errors = req.validationErrors();
    //console.log('passport signup');
    if (errors) {
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
            //console.log(error.msg);
        });
        return done(null, false, req.flash( 'error', messages));
    }
    userDAO.signUp(email, password,done);

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

    userDAO.signIn(email, password,done);
    
}));




