'use strict';

var bcrypt = require('bcrypt');
var Mongo = require('mongodb');
var User;
var users = global.nss.db.collection('users');
var fs = require('fs');
var path = require('path');

module.exports = User;
function User(user){
  this.name = user.name;
  this.email = user.email;
  this.password = user.password;
  this.photo = user.photo;
}

User.prototype.hashPassword = function(fn){
  var self = this;

  bcrypt.hash(self.password, 8,function(err, hash){
    self.password = hash;
    fn();
  });
};

User.prototype.save = function(fn){
  var self = this;
  users.findOne({email: self.email}, function(err, record){
    if(!record){
      users.findOne({name: self.name}, function(err, record){
        if(!record){
          users.insert(self, function(err, result){
            fn(result[0]);
          });
        }else{
          fn(false);
        }
      });
    }else{
      fn(false);
    }
  });
};

User.findById = function(id, fn){
  var _id = new Mongo.ObjectID(id);
  users.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};

User.findByName = function(name, fn){
  users.findOne({name:name}, function(err, record){
    fn(record);
  });
};

User.findByEmailAndPassword = function(email, password, fn){
  users.findOne({email:email}, function(err, record){
    if(record){
      bcrypt.compare(password, record.password, function(err, result){
        console.log('LLLLLLLLLLLLLLLLLL', result);
        if(result){
          console.log('IIIIIIIIIIIIIIIIIIII', record);
          fn(record);
        }else{
          fn(false);
        }
      });
    }else{
      fn(false);
    }
  });
};

User.findByEmail = function(email, fn){
  users.findOne({email:email}, function(err, record){
    fn(record);
  });
};

User.prototype.update = function(fn){
  var self = this;
  users.update({_id:this._id}, this, function(err, count){
    User.findById(self._id.toString(), function(record){
      fn(record);
    });
  });
};

User.prototype.addPhoto = function(oldpath, fn){
  var self = this;
  var email = this.email.replace(/@/g, '');
  email = email.replace(/\./g, '').toLowerCase();
  var dirname = email;
  var abspath = __dirname + '/../static';
  var extension = path.extname(oldpath);
  var ext = 'profile' + extension;
  var relpath = '/img/' + dirname;
  var newpath = relpath + '/' + ext;
  fs.mkdir(abspath + relpath, function(err){
    fs.rename(oldpath, abspath + newpath, function(){
      self.photo = newpath;
      fn();
    });
  });
};
