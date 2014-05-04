/* jshint expr:true */

'use strict';

process.env.DBNAME = 'barterTown-test';
var expect = require('chai').expect;
var Mongo = require('mongodb');
var fs = require('fs');
var exec = require('child_process').exec;
var Item, User;
var u1, u2;
var i1, i2, i3;

describe('Item', function(){
  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Item = require('../../app/models/item');
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/samaolcom/itempic/item*';
    var cmd = 'rm ' + testdir;
    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/europic.jpg';
      var copyfile = __dirname + '/../fixtures/europic-copy.jpg';
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

  describe('new', function(){
    it('should create a new Item object', function(){
      var i1 = new Item({owner:u1.name, name:'Node', year:'1957', description:'car', tags:'cool, yellow, small', cost:'$29.99', userId:u1._id.toString()});
      expect(i1.name).to.deep.equal('Node');
      expect(i1.description).to.deep.equal('car');
      expect(i1).to.be.instanceof(Item);
      expect(i1.year).to.deep.equal('1957');
      expect(i1.tags).to.have.length(3);
      expect(i1.userId).to.be.instanceof(Mongo.ObjectID);
    });
  });

  describe('#save', function(){
    it('should save the item into the db', function(done){
      var i1 = new Item({owner:u1.name, name:'Car to save', year:'1957', description:'car', tags:['cool', 'yellow', 'small'], cost:'$29.99', userId:u1._id.toString()});
      i1.save(function(item){
        expect(item._id.toString()).to.have.length(24);
        done();
      });
    });
  });

  describe('#update', function(){
    it('should update an existing item', function(done){
      var i1 = new Item({owner:u1.name, name:'Photo to save', year:'1954', description:'profile', tags:['cool', 'yellow', 'small'], cost:'$24.99', userId:u1._id.toString()});
      i1.save(function(item){
        i1.name = 'High';
        var oldId = i1._id.toString();
        i1.update(oldId, function(){
          Item.findById(oldId, function(item){
            expect(item.name).to.equal('High');
            expect(item._id.toString()).to.equal(oldId);
            done();
          });
        });
      });
    });
  });

  describe('find methods', function(){
    beforeEach(function(done){
      u2 = new User({name:'Bob', email:'bob@aol.com', photo:'http://www.site.com/image.jpg', password:'456hij'});
      u2.hashPassword(function(){
        u2.save(function(){
          i1 = new Item({name:'Car1 to save', year:'1957', description:'car', tags:['outrageous', 'yellow', 'small'], owner:u1.name, cost:'$29.99', userId:u1._id.toString()});
          i1.save(function(item){
            i2 = new Item({name:'Car2 to save', year:'1967', description:'car', tags:['mondo', 'yellow', 'medium'], owner:u2.name, cost:'$29.99', userId:u2._id.toString()});
            i2.save(function(item){
              i3 = new Item({name:'Car3 to save', year:'1977', description:'car', tags:['radical', 'yellow', 'large'], owner:u2.name, cost:'$29.99', userId:u2._id.toString()});
              i3.save(function(item){
                done();
              });
            });
          });
        });
      });
    });

    describe('.findAll', function(){
      it('should return 3 items', function(done){
        Item.findAll(function(records){
          expect(records).to.have.length(3);
          done();
        });
      });
    });

    describe('.findByYear', function(){
      it('should return 1 item', function(done){
        Item.findByYear('1967', function(records){
          expect(records).to.have.length(1);
          expect(records[0].year).to.equal('1967');
          done();
        });
      });
    });

    describe('.findById', function(){
      it('should return 1 item', function(done){
        Item.findById(i2._id.toString(), function(records){
          expect(records._id.toString()).to.have.length(24);
          expect(records._id).to.deep.equal(i2._id);
          done();
        });
      });
    });

    describe('.findByName', function(){
      it('should return item 2', function(done){
        Item.findByName('Car2 to save', function(records){
          expect(records).to.have.length(1);
          expect(records[0].name).to.equal('Car2 to save');
          done();
        });
      });
    });

    describe('.findByTags', function(){
      it('should return item 3', function(done){
        Item.findByTags('radical', function(records){
          expect(records).to.have.length(1);
          expect(records[0].name).to.equal('Car3 to save');
          done();
        });
      });
      it('should return all three items', function(done){
        Item.findByTags('yellow', function(records){
          expect(records).to.have.length(3);
          done();
        });
      });
    });

    describe('.findByUserId', function(){
      it('should find all items created by user', function(done){
        Item.findByUserId(u2._id.toString(), function(records){
          expect(records).to.have.length(2);
          done();
        });
      });
    });

    describe('deleteById', function(){
      it('should delete item from db', function(done){
        var id = i2._id.toString();
        Item.deleteById(id, function(count){
          Item.findById(id, function(item){
            expect(count).to.equal(1);
            expect(item).to.equal(null);
            done();
          });
        });
      });
    });
  });

  describe('#addPhoto', function(){
    it('should add a photo to the item', function(done){
      var i1 = new Item({name:'itemPic', year:'1954', description:'itemPic', tags:['cool', 'yellow', 'small'], owner:u1.name, cost:'$24.99', userId:u1._id.toString()});
      var oldName = __dirname + '/../fixtures/europic-copy.jpg';
      i1.addPhoto(oldName, function(){
        i1.save(function(ret){
          Item.findById(ret._id.toString(), function(record){
            expect(record.photo).to.deep.equal('/img/samaolcom/itempic/itemPhoto.jpg');
            done();
          });
        });
      });
    });
  });
});
