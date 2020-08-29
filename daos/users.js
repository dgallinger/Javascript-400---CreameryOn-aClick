const mongoose = require('mongoose');
const User = require('../models/users');

const bcrypt = require('bcrypt');


//signUp

module.exports.signUp = async (email, password, done) => {


User.findOne({'email': email},function (err, user){
    if (err){
        return done(err);
    }
    if (user){
        return done(null, false, {message: 'Email is already in use.'});
    }
    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.roles= ['admin']
    newUser.save(function(err, result){
        if (err){
            return done(err);
        }
        return done(null, newUser);
    })

});


};


//signIn
module.exports.signIn = async(email,password,done) =>{
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
};


//changepassword

module.exports.changePassword = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        return false;
    }else {

      const updatedPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 
      const updatedUser = await User.update({ email: email },  { password : updatedPassword });
      return updatedUser;
    } 
};
