const roleNameAdmin = 'admin';
module.exports = { roleNameAdmin }


/* 
 * Middleware to enforce authentication on protected routes.
 */
module.exports.isLoggedIn = (async (req, res, next) => { 
  try
  {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/');
    }
  }
  catch(err)
  {
    next(err)
  }
});



module.exports.notLoggedIn= (async (req, res, next) => {
  try
  {  
    if (!req.isAuthenticated()) {
        next();
    }
    else{
        res.redirect('/');
    }
  }
  catch(err)
  {
    next(err)
  }
});


module.exports.isAdmin = (async (req, res, next) => {
  
  if (req.user.roles.includes(roleNameAdmin)) {
    next();
  } else {
    res.sendStatus(403);
  }
});