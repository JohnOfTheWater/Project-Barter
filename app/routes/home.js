'use strict';

var Item = require('../models/item');
var limit = 9; //change this if you want more items on one page
var pages;

exports.index = function(req, res){
  Item.findRandomSix(function(items){
    res.render('home/index', {title: 'Project Barter', items:items});
  });
};

exports.user = function(req, res){
  console.log('userName: '+req.params.user);
  var userName = req.params.user;
  Item.getItemsLength(function(length){
    pages = Math.ceil(length / limit);
    Item.findSome(limit, 0, function(items){
      res.render('home/user', {title: 'BarterTown!', items:items, userName:userName, skip:0, limit:limit, pages:pages});
    });
  });
};

exports.skipSome = function(req, res){
  var skip = parseInt(req.params.skip); //skip, coming in here, is going to be the page number, hence why we multiply it by limit below
  var userName = req.params.user;
  Item.getItemsLength(function(length){
    pages = Math.ceil(length / limit);
    Item.findSome(limit, skip * limit, function(items){
      res.render('home/user', {title: 'BarterTown!', items:items, userName:userName, skip:skip, limit:limit, pages:pages});
    });
  });
};


exports.myBids = function(req, res){
  var userName = req.params.user;
  Item.findByUserId(req.session.userId, function(items){
    res.render('home/bids', {title: 'My Bids', items:items, userName:userName});
  });
};
exports.auth = function(req, res){
  res.render('home/auth', {title: 'Register'});
};

exports.listBids = function(req, res){
  Item.findById(req.params.id, function(item){
    res.send({item:item});
  });
};

exports.rndSix = function(req, res){
  Item.findRandomSix(function(items){
    res.send({items:items});
  });
};
