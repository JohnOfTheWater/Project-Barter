/* jshint expr:true */

'use strict';

process.env.DBNAME = 'barter-town';
var expect = require('chai').expect;
var User;
var fs = require('fs');
var exec = require('child_process').exec;
var u1, u2;

describe('User', function(){
  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/samaolcom/prof*';
    var cmd = 'rm ' + testdir;
    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/testpic.jpg';
      var copyfile = __dirname + '/../fixtures/testpic-copy.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile));
      global.nss.db.dropDatabase(function(err, result){
        u1 = new User({name: 'Sue', email:'sue@aol.com', password:'678utf', photo:'img.gif'});
        u1.hashPassword(function(){
          u1.save(function(){
            done();
          });
        });
      });
    });
  });

  describe('new', function(){
    it('should create a new User object', function(){
      u1 = new User({name: 'Sam', email:'sam@aol.com', password:'1234', photo:'img/photo.jpg'});
      expect(u1).to.be.instanceof(User);
      expect(u1.name).to.equal('Sam');
      expect(u1.email).to.equal('sam@aol.com');
      expect(u1.password).to.equal('1234');
    });
  });

  describe('#hashPassword', function(){
    it('should hash the users password', function(done){
      u1 = new User({name: 'Sam', email:'sam@aol.com', password:'1234'});
      u1.hashPassword(function(){
        expect(u1.password).to.not.equal('1234');
        done();
      });
    });
  });

  describe('#save', function(){
    it('should insert a new user in the DB', function(done){
      u1 = new User({name: 'Sam', email:'sam@aol.com', password:'1234'});
      u1.hashPassword(function(){
        u1.save(function(ret){
          expect(ret._id.toString()).to.have.length(24);
          done();
        });
      });
    });
    it('should not insert a duplicate user because of email', function(done){
      u2 = new User({name: 'Sue', email:'sue@aol.com', password:'678utf'});
      u2.save(function(ret){
        expect(u2._id).to.be.undefined;
        expect(ret).to.be.false;
        done();
      });
    });
    it('should not insert a duplicate user because of name', function(done){
      u2 = new User({name: 'Sue', email:'sue23@aol.com', password:'678utf'});
      u2.save(function(ret){
        expect(u2._id).to.be.undefined;
        expect(ret).to.be.false;
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find user by its id', function(done){
      u2 = new User({name: 'Sam', email:'sam@aol.com', password:'678utf'});
      u2.save(function(ret){
        User.findById(ret._id.toString(), function(ret1){
          expect(ret1.name).to.equal('Sam');
          done();
        });
      });
    });
  });

  describe('.findByName', function(){
    it('should find a user by his name', function(done){
      u1 = new User({name: 'Sam', email:'sam@aol.com', password:'678utf'});
      u1.save(function(){
        User.findByName('Sam', function(ret){
          expect(ret.name).to.equal('Sam');
          expect(ret.email).to.equal('sam@aol.com');
          done();
        });
      });
    });
  });

  describe('findByEmailAndPassword', function(){
    it('should return a user by email and password', function(done){
      User.findByEmailAndPassword('sue@aol.com', '678utf', function(record){
        expect(record._id).to.deep.equal(u1._id);
        done();
      });
    });
    it('should not return a user unless email is registered', function(done){
      User.findByEmailAndPassword('bad@aol.com', '678utf', function(record){
        expect(record).to.be.false;
        done();
      });
    });
    it('should not return a user with wrong password', function(done){
      User.findByEmailAndPassword('sue@aol.com', '402fij', function(record){
        expect(record).to.be.false;
        done();
      });
    });
  });

  describe('findByEmail', function(){
    it('should return a user by email', function(done){
      u2 = new User({name: 'Sam', email:'sam@aol.com', password:'678utf'});
      u2.save(function(ret){
        User.findByEmail('sam@aol.com', function(record){
          expect(record._id).to.deep.equal(ret._id);
          done();
        });
      });
    });
  });

  describe('#update', function(){
    beforeEach(function(done){
      u2 = new User({name: 'Sam', email:'sam@aol.com', password:'678utf'});
      u2.save(function(){
        done();
      });
    });
    it('should update an existing user', function(done){
      u2.email = 'robert@aol.com';
      u2.update(function(user){
        expect(user.email).to.equal('robert@aol.com');
        expect(user._id).to.deep.equal(u2._id);
        done();
      });
    });
  });

  describe('#addPhoto', function(){
    it('should add a photo to the user profile', function(done){
      u2 = new User({name: 'Sam', email:'sam@aol.com', password:'678utf'});
      var oldName = __dirname + '/../fixtures/testpic-copy.jpg';
      u2.addPhoto(oldName, function(){
        u2.save(function(record){
          User.findById(u2._id.toString(), function(record){
            expect(record.photo).to.deep.equal('/img/samaolcom/profile.jpg');
            done();
          });
        });
      });
    });
  });
});

