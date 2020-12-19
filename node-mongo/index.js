const MongoClient = require('mongodb').MongoClient;
const assert = require("assert");
//The assert module enables us to use the assert to check for truth or false values within our application
const dboper = require("./operations")

const url = 'mongodb://localhost:27017/';
const dbname = "conFusion";

//The connect method allows us to connect to the MongoClient from our MongoDB server
// first parameter is url of the MongoDB server
// second parameter is a callback function
// the callback function has two parameters, the error value, and client, which we can then use to connect to our database and then perform various operations.

MongoClient.connect(url, (err, client) => {
    assert.strictEqual(err, null)
    console.log("Connected correctly to server")
    const db = client.db(dbname);

    dboper.insertDocument(db, { name: "Vadonut", description: "Test" }, 'dishes', (result) => {
        console.log('Insert Documet:\n', result.ops);

        dboper.findDocument(db, 'dishes', (docs) => {
            console.log("Found Documents:\n", docs);

            dboper.updateDocument(db, { name: "Vadonut" }, { description: "Updated Test" }, 'dishes', (result) => {
                console.log('Updated Document:\n', result.result);

                dboper.findDocument(db, 'dishes', (docs) => {
                    console.log("Found Updated Documents:\n", docs);

                    db.dropCollection('dishes', (result) => {
                        console.log("Dropped Collection: ", result);
                    })
                })
            })
        })
    })

})



