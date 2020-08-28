const roleNameAdmin = 'admin';
module.exports = { roleNameAdmin }


/* 
 * Middleware to enforce authentication on protected routes.
 */
module.exports.isUserAuthenticated = (async (req, res, next) => { 
  try
  {
    //todo
    //next();
  }
  catch(err)
  {
    next(err)
  }
});

/*
 * Middleware to verify authenticated user is in Admin role.
 * + You'll want to write an isAdmin middleware function that can be reused. 
 * + If the user making the request is not an admin it should respond with a 403 Forbidden error.
 */
module.exports.isAdmin = (async (req, res, next) => {
  // assumes Request.user exists, so use after authentication middleware
  // if (req.user.roles.includes(roleNameAdmin)) { 
  //   next(); 
  // } else { 
  //   res.sendStatus(403); // 403 Forbidden 
  // }
});