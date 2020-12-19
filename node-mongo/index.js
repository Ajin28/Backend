const MongoClient = require('mongodb').MongoClient;
const assert = require("assert");
//The assert module enables us to use the assert to check for truth or false values within our application

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
    const collection = db.collection("dishes")
    collection.insertOne({ "name": "pizza", "description": "yummmy" }, (err, result) => {

        assert.strictEqual(err, null)

        console.log("After Insert:\n")
        console.log(result.ops)
        //This result will also provide this OPS property which says how many operations have just been carried out successfully.

        collection.find({}).toArray((err, docs) => {
            assert.strictEqual(err, null)
            console.log("Found:\n")
            console.log(docs);

            db.dropCollection("dishes", (err, result) => {
                assert.strictEqual(err, null)
                client.close();
            })
        })
    })
})



