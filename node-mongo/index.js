// We know that the node MongoDB driver natively supports promises.
// So, if you do not specify a callback, the calls to their functions will return promises.


const MongoClient = require('mongodb').MongoClient
const assert = require("assert");
//The assert module enables us to use the assert to check for truth or false values within our application
const dboper = require("./operations")

const url = 'mongodb://localhost:27017/';
const dbname = "conFusion";

//The connect method allows us to connect to the MongoClient from our MongoDB server
// first parameter is url of the MongoDB server
// second parameter is a callback function
// the callback function has two parameters, the error value, and client, which we can then use to connect to our database and then perform various operations.

MongoClient.connect(url)
    .then((client) => {
        console.log("Connected correctly to server")
        const db = client.db(dbname);

        dboper.insertDocument(db, { name: "Vadonut", description: "Test" }, 'dishes')
            .then((result) => {
                console.log('Insert Documet:\n', result.ops);
                return dboper.findDocument(db, 'dishes')
            })
            .then((docs) => {
                console.log("Found Documents:\n", docs);
                return dboper.updateDocument(db, { name: "Vadonut" }, { description: "Updated Test" }, 'dishes')
            })

            .then((result) => {
                console.log('Updated Document:\n', result.result);
                return dboper.findDocument(db, 'dishes')
            })
            .then((docs) => {
                console.log("Found Updated Documents:\n", docs);
                return db.dropCollection('dishes')
            })
            .then((result) => {
                console.log("Dropped Collection: ", result);
                return client.close()
            })
            .catch(err => { console.log(err); })
    })
    .catch(err => { console.log(err); })


