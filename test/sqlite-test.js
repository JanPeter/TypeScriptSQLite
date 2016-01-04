var fs = require('fs');
var _ = require('underscore');

var Sqlite = require('../lib/sqlite');
var db;

var path = require('path');

var expect = require('chai').expect;

describe('SQLite-Object-Mapper module', function() {
  beforeEach(function(done) {
    db = new Sqlite.Sqlite('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT UNIQUE);', function(row) {
      return { id: row.id, name: row.name };
    }, function(error) {
      done();
    }, 'test.db');
  });
  
  describe('#insert', function() {
    it('should insert a test element without errors', function (done) {
      db.insert('INSERT INTO test (name) VALUES (?)', ['asdf'], function(err) {
        expect(err).to.be.null;
        db.get('SELECT * FROM test WHERE name = ?', ['asdf'], function(err, test) {
          expect(err).to.be.null;
          expect(test).to.eql({id: 1, name: 'asdf'});
          done();
        });
      });
    });
    
    it('should insert a test element with error (UNIQUE)', function (done) {
      db.insert('INSERT INTO test (name) VALUES (?)', ['asdf'], function(err) {
        expect(err).to.be.null;
        db.insert('INSERT INTO test (name) VALUES (?)', ['asdf'], function(err) {
          expect(err).not.to.be.null;
          expect(err.errno).to.equal(19);
          done();
        });
      });
    });
  });
  
  describe('#delete', function() {
    it('should remove a test element without errors', function (done) {
      db.insert('INSERT INTO test (name) VALUES (?)', ['asdf'], function(err) {
        expect(err).to.be.null;
        
        db.get('SELECT * FROM test WHERE name = ?', ['asdf'], function(err, test) {
          expect(err).to.be.null;
          expect(test).to.eql({id: 1, name: 'asdf'});
          
          db.delete('DELETE FROM test WHERE name = ?', ['asdf'], function(err) {
            expect(err).to.be.null;
            
            db.get('SELECT * FROM test WHERE name = ?', ['asdf'], function(err, test) {
              expect(err).to.be.null;
              expect(test).to.be.null;
              done();
            });
          });
        });
      });
    });
    
    it('should insert a deleted test element without errors again', function (done) {
      db.insert('INSERT INTO test (name) VALUES (?)', ['asdf'], function(err) {
        expect(err).to.be.null;
          
        db.delete('DELETE FROM test WHERE name = ?', ['asdf'], function(err) {
          expect(err).to.be.null;
          db.insert('INSERT INTO test (name) VALUES (?)', ['asdf'], function(err) {
            expect(err).to.be.null;
          
            db.get('SELECT * FROM test WHERE name = ?', ['asdf'], function(err, test) {
              expect(err).to.be.null;
              expect(test).to.eql({id: 1, name: 'asdf'});
              done();
            });
          });
        });
      });
    });
  });
  
  describe('#all', function() {
    it('should return test array without errors', function (done) {
      db.insert('INSERT INTO test (name) VALUES (?)', ['asdf'], function(err) {
        expect(err).to.be.null;
        db.insert('INSERT INTO test (name) VALUES (?)', ['asdf2'], function(err) {
          expect(err).to.be.null;
          
          db.all(function(err, list) {
            expect(err).to.be.null;
            expect(list.length).to.equal(2);
            expect(_.first(list)).to.eql({id: 1, name: 'asdf'});
            expect(_.last(list)).to.eql({id: 2, name: 'asdf2'});
            done();
          });
        });
      });
    });
    
    it('should return empty array without errors', function (done) {
      db.all(function(err, list) {
        expect(err).to.be.null;
        expect(list).not.to.be.null;
        expect(list.length).to.equal(0);
        done();
      });
    });
  });
  
  afterEach(function(done) {
    db.close(function(err) {
      fs.unlinkSync('test.db');
      done();
    })
  });
});