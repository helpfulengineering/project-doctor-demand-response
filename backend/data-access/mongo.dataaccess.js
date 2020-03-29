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
                query
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
    count: async function(collection, query) {
        let count = 0;
        try {
            count = dbMgr.dbConnection.collection(collection).countDocuments(
                query
            );
            await count.then(doc => {
                
            }).catch(err => {
                count =0;
                console.log(err);
            });
        } catch(err) {
            console.log(err);
        };

        return count;
    },
    search: async function(collection, criteria) {
        let results = [];
        try {
            if(criteria.startRow < 0) {
                criteria.startRow = 0;
            }
            if(criteria.endRow < 0) {
                criteria.endRow = 10;
            }
            
            /*let cursor = dbMgr.dbConnection.collection(collection).find(
                mongoDataAccess.constructQuery(criteria),
                {}
            ).sort(criteria.sort).skip(criteria.startRow > 0 ? criteria.startRow : 0).limit(criteria.endRow - criteria.startRow);*/

            let pipelines = [
                { $lookup: criteria.lookup },
                { $unwind: criteria.unwind },
                { $match: mongoDataAccess.constructQuery(criteria)},
            ];

            if(Object.keys(criteria.sort).length > 0) {
                pipelines.push({ $sort: criteria.sort });
            }
            pipelines.push({ $skip: (criteria.startRow > 0 ? criteria.startRow : 0) });
            pipelines.push({ $limit: criteria.endRow - criteria.startRow });
            
            await dbMgr.dbConnection.collection(collection).aggregate(pipelines)
                .toArray()
                .then(records => {
                    records.forEach(data => results.push(data));
                });
            
        } catch(err) {
            console.log(err);
        };
        
        return results;
    },
    constructQuery: function(criteria) {
        let filter = {};
        if(criteria.filter && criteria.filter.field_name && criteria.filter.filter_text) {
            filter[criteria.filter.field_name] = {$regex: new RegExp('^.*' + criteria.filter.filter_text.toLowerCase() + '.*', 'i')};
        }
        console.log(filter);
        return filter;
    }
};


module.exports = mongoDataAccess;