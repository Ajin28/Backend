const mongoose = require('mongoose')

const Dishes = require('./models/dishes')

const url = "mongodb://localhost:27017/conFusion"

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
    .then((db) => {
        console.log("Connected to conFusion")
        var newDish = Dishes({
            name: 'Uthappiza',
            description: "test"
        })

        newDish.save()
            .then((dish) => {
                console.log(dish);
                return Dishes.find({}).exec();
            })
            .then((dishes) => {
                console.log(dishes);
                return Dishes.deleteMany({})
            })
            .then(() => {
                mongoose.connection.close()
            })
            .catch((err) => { console.log(err); })
    });