/* jshint expr:true */

'use strict';

process.env.DBNAME = 'barter-test';
var app = require('../../app/app');
var request = require('supertest');
//var expect = require('chai').expect;
var User, Item;
var uEx;
var cookie;

describe('Items', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      Item = require('../../app/models/item');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      uEx = new User({name:'Giovanni', email:'penis@aol.com', photo:'blah blah blah', password:'1234'});
      uEx.hashPassword(function(){
        uEx.save(function(){
          done();
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

  describe('GET /items', function(){
    it('should not display items page if user isnt logged in', function(done){
      request(app)
      .get('/items')
      .expect(404, done);
    });
  });

  describe('AUTHORIZED', function(){
    beforeEach(function(done){
      request(app)
      .post('/login')
      .field('name', 'Giovanni')
      .field('email', 'penis@aol.com')
      .field('password', '1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'];
        done();
      });
    });

    describe('GET /items', function(){
      it('should display items page if user is logged in', function(done){
        request(app)
        .get('/items')
        .set('cookie', cookie)
        .expect(404, done);
      });
    });

    describe('POST /items', function(){
      it('should insert a new item object in the db', function(done){
        var i1 = new Item({name:'Photo to save',
                           year:'1954',
                           description:'profile',
                           tags:['cool', 'yellow', 'small'],
                           cost:'$24.99',
                           user:uEx._id.toString()});
        request(app)
        .post('/items')
        .send(i1)
        .set('cookie', cookie)
        .expect(404, done);
      });
    });

    describe('GET /items/:id', function(){
      it('should display the item selected on a different page', function(done){
        var i1 = new Item({name:'Photo to save',
                           year:'1954',
                           description:'profile',
                           tags:['cool', 'yellow', 'small'],
                           cost:'$24.99',
                           user:uEx._id.toString()});
        i1.save(function(item){
          request(app)
          .get('/items/' + i1._id.toString())
          .set('cookie', cookie)
          .expect(200, done);
        });
      });
    });

    describe('DELETE /items/:id', function(){
      it('should delete an item from the notes database', function(done){
        var i1 = new Item({name:'Photo to save',
                           year:'1954',
                           description:'profile',
                           tags:['cool', 'yellow', 'small'],
                           cost:'$24.99',
                           user:uEx._id.toString()});
        i1.save(function(item){
          request(app)
          .del('/items/' + i1._id.toString())
          .set('cookie', cookie)
          .expect(404, done);
        });
      });
    });
  });
});
