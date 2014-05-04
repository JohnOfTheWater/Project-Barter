'use strict';

var d = require('../lib/request-debug');
var initialized = false;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = require('../routes/home');
  var users = require('../routes/users');
  var items = require('../routes/items');

  app.get('/', d, home.index);
  app.get('/auth', d, home.auth);
  app.get('/user/:user', d, home.user);
  app.get('/user/:user/:skip', d, home.skipSome);
  app.get('/showUser/:user', d, users.show);
  app.post('/auth', d, users.register);
  app.post('/login', d, users.login);
  app.get('/logout', d, users.logout);
  //---------Search------------//
  app.get('/searchByName/:name', d, items.searchName);
  app.get('/searchByCat/:cat', d, items.searchCat);
  app.get('/searchByLuck', d, items.searchLuck);
  app.get('/searchByBids/:id', d, items.searchBids);
  //app.post('/logout', d, users.logout);
  //---------Items------------//
  app.get('/items/:user', d, items.new);
  //app.get('/allItems/:user', d, home.allItems);
  app.get('/myItems/:user', d, items.userItems);
  app.get('/myBids/:user', d, home.myBids);
  app.get('/findMyBids/:id', d, home.listBids);
  app.post('/items/:user', d, items.create);
  app.post('/bidItem/:user', d, items.bidItem);
  //app.get('/items', d, items.index);
  app.get('/item/:id', d, items.show);
  //app.del('/items/:id', d, items.destroy);
  app.del('/removeItems/:id', d, items.sendWinnerEmail, items.destroy); //this only gets called when someone wins an item
  //app.del('/deleteBidItem/:name/:user', d, items.destroyBid);
  console.log('Routes Loaded');
  fn();
}

