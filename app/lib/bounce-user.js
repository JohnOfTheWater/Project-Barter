'use strict';


module.exports = function(req, res, next){
  if(req.url === '/' || req.url === '/auth' || req.url === '/login' || req.url === '/register'){
    next();
  } else {
    if(req.session.userId){
      next();
    }else{
      res.redirect('/');
    }
  }
};
