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
    search: async function(collection, criteria) {
        let results = [];
        try {
            let cursor = dbMgr.dbConnection.collection(collection).find(
                mongoDataAccess.constructQuery(criteria),
                {}
            ).sort(criteria.sort).skip((criteria.page > 1 ? criteria.page - 1 : 0) * criteria.pageSize).limit(criteria.pageSize);
            
            await cursor.forEach(data => results.push(data));
        } catch(err) {
            console.log(err);
        };
        console.log(results);
        return results;
    },
    constructQuery: function(criteria) {
        return {};
    }
};


module.exports = mongoDataAccess;