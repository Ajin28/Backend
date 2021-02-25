const express = require('express')
const favRouter = express.Router();
const mongoose = require('mongoose');
const Favorite = require('../models/favorite');
const Dishes = require('../models/dishes');
const User = require('../models/user')
const authenticate = require('../authenticate');
const cors = require('./cors')


favRouter.route("/")
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        //populate user and dishes
        Favorite.findOne({ user: req.user.id })
            .populate('dishes').populate('user').then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(favorites)
            })
            .catch(err => {
                next(err);
            })

    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        // add multiple dishes 
        Favorite.findOne({ user: req.user.id })
            .then((favorites) => {
                if (favorites === null) {
                    var dishes = [];
                    for (var i = 0; i < req.body.length; i++)
                        dishes.push(req.body[i]._id);

                    Favorite.create({ user: req.user.id, dishes: dishes })
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json')
                            res.json(fav)
                        })
                        .catch(err => { next(err) })

                }
                else {
                    for (i = 0; i < req.body.length; i++) {
                        favorites.dishes.push(req.body[i]._id)
                    }
                    favorites.save()
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json')
                            res.json(fav)
                        })
                        .catch(err => { next(err) })

                }

            })
            .catch(err => {
                next(err);
            })
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        // delete multiple dishes
        Favorite.findOne({ user: req.user.id })
            .then((favorites) => {
                if (favorites === null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    res.json('No favorites exists')

                }
                else {
                    for (i = 0; i < req.body.length; i++) {
                        favorites.dishes.pull(req.body[i]._id)
                    }
                    favorites.save()
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json')
                            res.json(fav)
                        })
                        .catch(err => { next(err) })

                }

            })
            .catch(err => {
                next(err);
            })
    })


favRouter.route("/:dishId")
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        // add specified dish
        Favorite.findOne({ user: req.user.id })
            .then((favorite) => {
                console.log("favorite  ", favorite);
                if (favorite === null) {
                    Favorite.create({ user: req.user.id, dishes: [req.params.dishId] })
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json')
                            res.json(fav)
                        })
                        .catch(err => { next(err) })
                }
                else {
                    favorite.dishes.push(req.params.dishId)
                    favorite.save()
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json')
                            res.json(fav)
                        })
                        .catch(err => { next(err) })



                }
            })
            .catch(err => {
                next(err)
            })


    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        // delete specified dish
        Favorite.findOne({ user: req.user.id })
            .then((fav) => {
                if (fav === null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    res.json("No favorite exists")

                } else {
                    fav.dishes.pull(req.params.dishId);
                    fav.save()
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json')
                            res.json(fav)
                        })
                        .catch(err => { next(err) })

                }
            })
    })

module.exports = favRouter;