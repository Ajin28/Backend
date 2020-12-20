const mongoose = require('mongoose')

const Dishes = require('./models/dishes')

const url = "mongodb://localhost:27017/conFusion"

mongoose.connect(url, { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true })
    .then((db) => {
        console.log("Connected to conFusion")
        Dishes.create({
            name: 'Uthappiza',
            description: "test"
        })
            //  This second flag that we are supplying here, new colon equal to true, means that once the update of the dish is complete, then this will return the dish, updated dish back to us
            .then((dish) => {
                console.log(dish);
                return Dishes.findByIdAndUpdate(dish._id,
                    {
                        $set: { description: "Updated test" }
                    },
                    {
                        new: true
                    }).exec();
            })
            .then((dish) => {
                console.log(dish);
                dish.comments.push({
                    rating: 5,
                    comment: "i like it",
                    author: 'Ajin28'
                })

                return dish.save()
            })
            .then((dish) => {
                console.log(dish);
                return Dishes.deleteMany({})
            })
            .then(() => {
                mongoose.connection.close()
            })
            .catch((err) => { console.log(err); })
    });