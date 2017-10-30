'use strict';
var MongoClient = require('mongodb').MongoClient;
var Q = require("q");
module.exports = class DB {

  constructor() {
    this.url = 'mongodb://localhost:27017/mydatabase';
  }
  // get all
  select(collection) {
    let deferred = Q.defer();
    MongoClient.connect(this.url, (err, db) => {
      if (err) deferred.reject(err);
      db.collection(collection).find().toArray((err, res) => {
        if (err) deferred.reject(err);
        deferred.resolve(res)
      })
      db.close()
    })
    return deferred.promise;
  }
  //insert One
  insert(object, collection) {
    let deferred = Q.defer();
    MongoClient.connect(this.url, (err, db) => {
      if (err) deferred.reject(err);
      db.collection(collection).insertOne(object, (err, res) => {
        if (err) deferred.reject(err);
        deferred.resolve(res)
      })
      db.close()
    })
    return deferred.promise;
  }
  //create table
  createCollection(collectionName) {
    let deferred = Q.defer();
    MongoClient.connect(this.url, (err, db) => {
      if (err) deferred.reject(err);
      db.createCollection(collectionName, (err, res) => {
        if (err) deferred.reject(err);
        console.log(res)
        deferred.resolve(res)
      })
      db.close()
    })
    return deferred.promise;
  }
  //remove record of collection
  removeRecord(collection,query){
    let deferred = Q.defer();
    MongoClient.connect(this.url,(err, db) => {
      if(err) deferred.reject(err)
      db.collection(collection).remove(query,(err, obj)=>{
        if(err) deferred.reject(err);
        deferred.resolve(obj)
      });
      db.close();
    })
  }
  
  updateCollection() { }

}