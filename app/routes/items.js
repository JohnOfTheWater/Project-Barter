'use strict';

var Item = require('../models/item');
var User = require('../models/user');
var sendEmail = require('../lib/send-email');
//var Mongo = require('mongodb');

exports.index = function(req, res){
  Item.findAll(function(items){
    res.render('items/index', {title:'Items Page', items:items});
  });
};

exports.new = function(req, res){
  var userName = req.params.user;
  res.render('items/new', {title:'New Item', userName:userName});
};

exports.create = function(req, res){
  var userName = req.params.user;
  console.log('inside create: '+req.files);
  req.body.userId = req.session.userId;
  req.body.owner = req.params.user;
  var item = new Item(req.body);
  console.log('HAS PHOTO: ' + req.files.photo.path);
  item.addPhoto(req.files.photo.path, function(){
    item.save(function(note){
      res.redirect('/user/'+userName);
    });
  });
};

exports.bidItem = function(req, res){
  console.log('req.body._id: '+req.body._id);
  console.log('req.body.bids: '+req.body.bids);
  var userName = req.params.user;
  req.body.tags = userName;
  Item.findById(req.body._id, function(foundItem){
    var item = new Item(foundItem);
    item.bids.push(req.body.bids);
    item.update(foundItem._id.toString(), function(item){
      res.send({userName:userName});
    });
  });
  //item.updateItem(req.body._id, function(item){
  //  res.send({userName:userName});
  //});
};

exports.destroy = function(req, res){
  //name: buyer's item, id: seller's item
  console.log('req.body.name: '+req.body.name);
  console.log('req.params.id: '+req.params.id);
  Item.deleteById(req.params.id, function(count){
    console.log('inside del req.body.name: '+req.body.name);
    Item.deleteByName(req.body.name, function(count){
      res.send({name:req.body.name});
    });
  });
};

exports.sendWinnerEmail = function(req, res, next){
  Item.findById(req.params.id, function(sellerItem){
    User.findById(sellerItem.userId.toString(), function(seller){
      Item.findByName(req.body.name, function(buyerItem){
        buyerItem = buyerItem[0];
        User.findById(buyerItem.userId.toString(), function(buyer){
          sendEmail(req, res, {
            from: 'noreply@fakesite.com',
            to: seller.email,
            subject: 'You sold an item on Barter Town',
            text: 'Your item, ' + sellerItem.name + ', just got sold on Barter Town in exchange for ' + buyerItem.name + ' (belonging to ' + buyer.name + ').'
          }, function(){
            sendEmail(req, res, {
              from: 'noreply@fakesite.com',
              to: buyer.email,
              subject: 'You bought an item on Barter Town',
              text: seller.name + ', the owner of ' + sellerItem.name + ' has accepted your bid of ' + buyerItem.name + ' on their item. Congratulations!'
            }, function(){
              next(); //sendWinnerEmail gets called in the pipeline, so we're not doing a render/redirect here
            });
          });
        });
      });
    });
  });
};

/*
exports.destroyBid = function(req, res){
  console.log('req.params.name: '+req.params.name);
  Item.deleteByName(req.params.name, function(count){
    res.redirect('/user/'+req.params.user);
  });
};
*/
exports.show = function(req, res){
  console.log('req.params.id: '+req.params.id);
  var id = req.params.id.substr(0, 24);
  var user = req.params.id.substr(24);
  Item.findById(id, function(item){
    res.render('items/show', {item:item, user:user});
  });
};

exports.userItems = function(req, res){
  console.log('userId: '+req.session.userId);
  Item.findByUserId(req.session.userId, function(items){
    res.send({items:items});
  });
};

exports.searchName = function(req, res){
  Item.findByName(req.params.name, function(items){
    res.send({items:items});
  });
};

exports.searchCat = function(req, res){
  Item.findByCat(req.params.cat, function(items){
    res.send({items:items});
  });
};

exports.searchLuck = function(req, res){
  Item.findByLuck(function(items){
    res.send({items:items});
  });
};

exports.searchBids = function(req, res){
  Item.findById(req.params.id, function(items){
    res.send({items:items});
  });
};
