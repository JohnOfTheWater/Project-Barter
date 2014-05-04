/* jshint expr:true */

'use strict';

process.env.DBNAME = 'barter-test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var exec = require('child_process').exec;
var fs = require('fs');
var User;
var u1;

describe('users', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/samaolcom/prof*';
    var cmd = 'rm -rf ' + testdir;
    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/testpic.jpg';
      var copyfile = __dirname + '/../fixtures/testpic-copy.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copyfile));
      global.nss.db.dropDatabase(function(err, result){
        u1 = new User({name:'Sam', email:'sam@aol.com', password:'678utf'});
        u1.hashPassword(function(){
          u1.save(function(){
            done();
          });
        });
      });
    });
  });

  describe('GET /', function(){
    it('should display the new home page', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });

  describe('GET /auth', function(){
    it('should display the authorization page', function(done){
      request(app)
      .get('/auth')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        //expect(res.text).to.include('User Authentication');
        done();
      });
    });
  });

  describe('POST /auth', function(){
    it('should register a user', function(done){
      var file = __dirname + '/../fixtures/testpic-copy.jpg';
      request(app)
      .post('/auth')
      .field('name', 'Bob')
      .field('email', 'bob@aol.com')
      .field('password', '1234')
      .attach('photo', file)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
    it('should not register a duplicate user', function(done){
      var file = __dirname + '/../fixtures/testpic-copy.jpg';
      request(app)
      .post('/auth')
      .field('name', 'Sam')
      .field('email', 'sam@aol.com')
      .field('password', '123456')
      .attach('photo', file)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        //expect(res.text).to.include('User Authentication');
        done();
      });
    });
  });

  describe('POST /login', function(){
    it('should log in a good user', function(done){
      request(app)
      .post('/login')
      .field('email', 'sam@aol.com')
      .field('password', '678utf')
      .end(function(err, res){
        expect(res.body.success).to.equal(true);
        done();
      });
    });
    it('should not log in a bad user', function(done){
      request(app)
      .post('/login')
      .field('email', 'bob@aol.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.body.success).to.equal(false);
        done();
      });
    });
  });

  describe('POST /logout', function(){
    it('should logout user', function(done){
      request(app)
      .post('/logout')
      .end(function(err, res){
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
});
