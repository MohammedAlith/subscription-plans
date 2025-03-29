const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';

const dbName = 'subscriptionDB';
let db;

const connectToDB = (callback) => {
    MongoClient.connect(url)
        .then((client) => {
            db = client.db(dbName);
            console.log(' Connected to MongoDB');
            callback();
        })
        .catch((err) => {
            console.error(' Error connecting to MongoDB:', err);
        });
};

const getDB = () => db;

module.exports = {
    connectToDB,
    getDB
};
