var express = require('express');
ObjectID = require('mongodb').ObjectID;
var dbMgr = require('../data-access/db-manager');

let mongoDataAccess = {
    add: function(collection, data) {
        console.log('Creating record for collection: ' + collection);
        dbMgr.dbConnection.collection(collection).insertOne(data);
    },
    update: function(collection, data) {
        let id = data._id;
        delete data._id;
        const update = {"$set": data};
        
        dbMgr.dbConnection.collection(collection).updateOne({ "_id": new ObjectID(id) }, update, { "upsert": false })
        .then(result => {
            if(result.matchedCount > 0) {
                console.log("Updated " + result);
            } else {
                console.log("No matching records found in collection " + collection + " for id " + id);
            }
            
        })
        .catch(err => console.error(`Failed to add review: ${err}`));
    },
    delete: function(collection, id) {
        dbMgr.dbConnection.collection(collection).remove(
            { "_id": new ObjectID(id) },
            {
              justOne: true
            }
            );
    },
    view: async function(collection, id) {
        let doc = {};
        try {
            id = new ObjectID(id);
            doc = dbMgr.dbConnection.collection(collection).findOne(
                { "_id": id },
                {}
                );
            await doc.then(doc => {
                console.log(doc);
            }).catch(err => {
                doc = {};
                console.log(err);
            });
        } catch(err) {
            console.log(err);
        };

        return doc;
    },
    find: async function(collection, query) {
        let doc = {};
        try {
            doc = dbMgr.dbConnection.collection(collection).findOne(
                query,
                {}
            );
            await doc.then(doc => {
                
            }).catch(err => {
                doc = {};
                console.log(err);
            });
        } catch(err) {
            console.log(err);
        };

        return doc;
    },
    search: function(collection, criteria) {
        console.log('controller called');
    }
};


module.exports = mongoDataAccess;