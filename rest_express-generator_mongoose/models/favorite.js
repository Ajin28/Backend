const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const favoriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'

    },
    dishes: [
        {

            type: Schema.Types.ObjectId,
            ref: 'dish',
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model("favorite", favoriteSchema)

