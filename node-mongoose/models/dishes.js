const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("dish", dishSchema)

// The timestamps allow you to have two different fields in the document: 
// the created at field and the updated at field, 
// both of which are timestamps stored in the form of an ISO date string in the document.

// The unique field specifies no two documeants can have the same value in this field (here name)

// The required field specifies that every document should contain the this field.
