'use strict';

module.exports = Item;

var fs = require('fs');
var items = global.nss.db.collection('items');
//var bids = global.nss.db.collection('bids');
//var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');
var User = require('../models/user');
var path = require('path');

function Item(data){
  this.owner = data.owner;
  this.name = data.name;
  this.year = data.year;
  this.description = data.description;
  this.photo = data.photo;
  this.cost = data.cost;
  if (typeof data.tags === 'object'){ //note: arrays are of type 'object'
    this.tags = data.tags;
  } else {
    this.tags = data.tags.split(',').map(function(tag){return tag.trim();});
    this.tags = _.compact(this.tags);
  }
  this.bids = data.bids || [];
  this.userId = data.userId ? new Mongo.ObjectID(data.userId.toString()) : data.userId;
  this.winner = data.winner ? new Mongo.ObjectID(data.winner.toString()) : data.winner;
}


/*function convert(x){
  x = x.toString();
  x = x.split(',');
  return x;
}*/


Item.findAll = function(fn){
  items.find().sort({_id:-1}).toArray(function(err, records){
    fn(records);
  });
};

Item.findRandomSix= function(fn){
  items.find().toArray(function(err, records){
    records = _.sample(records, 6);
    fn(records);
  });
};

Item.findByLuck= function(fn){
  items.find().toArray(function(err, records){
    records = _.sample(records, 1);
    fn(records);
  });
};

Item.findSome = function(limit, skip, fn){
  items.find().limit(limit).skip(skip).sort({_id:-1}).toArray(function(err, records){
    fn(records);
  });
};

Item.getItemsLength = function(fn){
  items.find().toArray(function(err, records){
    fn(records.length);
  });
};

Item.findByName = function(name, fn){
  console.log('here'+name);
  items.find({name:name}).toArray(function(err, records){
    fn(records);
  });
};

Item.findByYear = function(year, fn){
  items.find({year: year}).toArray(function(err, records){
    fn(records);
  });
};

Item.prototype.save = function(fn){
  items.insert(this, function(err, item){
    fn(item[0]);
  });
};

Item.prototype.updateItem = function(id, fn){

  var query = {_id : id};

  items.update(query, this, function(err, item){
    fn(item[0]);
  });
};

Item.findByUserId = function(idToSearch, fn){
  idToSearch = new Mongo.ObjectID(idToSearch);
  items.find({userId:idToSearch}).toArray(function(err, records){
    fn(records);
  });
};

Item.findById = function(id, fn){
  var _id = new Mongo.ObjectID(id);
  items.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

Item.findByTags = function(tag, fn){
  items.find({tags: {$in: [tag]}}).toArray(function(err, records){
    fn(records);
  });
};

Item.findByCat = function(tag, fn){
  items.find({tags: {$in: [tag]}}).toArray(function(err, records){
    fn(records);
  });
};

Item.prototype.addPhoto = function(oldpath, fn){
  var self = this;
  User.findById(this.userId.toString(), function(ret){
    var email = ret.email.replace(/@/g, '');
    email = email.replace(/\./g, '').toLowerCase();
    var name = self.name.replace(/\s/g , '');
    name = name.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, '').toLowerCase();
    var dirname = email + '/' + name;
    var abspath = __dirname + '/../static';
    var extension = path.extname(oldpath);
    var ext = 'itemPhoto' + extension;
    var relpath = '/img/' + dirname;
    var newpath = relpath + '/' + ext;
    fs.mkdir(abspath + relpath, function(){
      fs.rename(oldpath, abspath + newpath, function(){
        self.photo = newpath;
        fn();
      });
    });
  });
};

/*
Item.prototype.addPhoto = function(oldpath, filename, fn){
  var self = this;
  User.findById(this.user.toString(), function(user){
    var email = user.email.replace(/@/g, '');
    email = email.replace(/\./g, '');
    var name = self.name.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    name = name.replace(/\s/g , '');
    var dirname = email + '/' + name;
    var abspath = __dirname + '/../static';
    var relpath = '/img/' + dirname + '/' + filename;
    fs.rename(oldpath, abspath + relpath, function(err){
      self.photo = relpath;
      Item.findById(self._id.toString(), function(item){
        fn(item);
      });
    });
  });
};
*/
Item.deleteById = function(id, fn){
  var _id = new Mongo.ObjectID(id);
  items.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

Item.deleteByName = function(name, fn){
  items.remove({name:name}, function(err, count){
    fn(count);
  });
};

Item.prototype.update = function(id, fn){
  var _id = new Mongo.ObjectID(id);
  items.update({_id:_id}, this, function(err, count){
    fn(count);
  });
};
