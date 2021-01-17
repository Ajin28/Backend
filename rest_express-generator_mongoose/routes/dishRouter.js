const express = require('express')
const bodyParser = require('body-parser')
const dishRouter = express.Router();
const mongoose = require('mongoose');
const Dishes = require('../models/dishes')
const authenticate = require('../authenticate');

dishRouter.use(bodyParser.json())

//the dishRouter, it supports a method called route method, which can take in an endpoint as a parameter.
dishRouter.route("/")
    .get((req, res, next) => {
        Dishes.find({}).then((dishes) => {
            res.statusCode = 200;
            // Since we are going to be returning the value as a json, so we'll set that to application json
            res.setHeader('Content-Type', 'application/json')
            //So the res.json will take as an input a json string and then send it back as a json response.
            // It will put this dishes into the body of the reply message and then send it back to the server.
            res.json(dishes)
        }, (err) => { next(err) })
            .catch((err) => { next(err) })

        //So if an error is returned, then that'll simply pass off the error to the overall error handler for my application
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Dishes.create(req.body)
            .then((dish) => {
                console.log('Dish Created ', dish);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(dish)
            }, (err) => { next(err) })
            .catch((err) => { next(err) })

    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.deleteMany({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, (err) => { next(err) })
            .catch((err) => { next(err) })

    })

dishRouter.route("/:dishId")
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(dish)
            }, (err) => { next(err) })
            .catch((err) => { next(err) })

    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/' + req.params.dishId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(dish)
            }, (err) => { next(err) })
            .catch((err) => { next(err) })

    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findByIdAndDelete(req.params.dishId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.json(resp)
            }, (err) => { next(err) })
            .catch((err) => { next(err) })


    });


dishRouter.route("/:dishId/comments/")
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    res.json(dish.comments)
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err)
                }
            }, (err) => { next(err) })
            .catch((err) => { next(err) })

    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    dish.comments.push(req.body);
                    dish.save().then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json')
                        res.json(dish)
                    }, (err) => { next(err) })
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err)
                }
            }, (err) => { next(err) })
            .catch((err) => { next(err) })

    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes/' + req.params.dishId + '/comments');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    for (var i = (dish.comments.length - 1); i >= 0; i--) {
                        // way to access a subdocument and delete it
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    dish.save().then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json')
                        res.json(dish)
                    })
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err)
                }
            }, (err) => { next(err) })
            .catch((err) => { next(err) })

    })

dishRouter.route("/:dishId/comments/:commentId")
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json')
                    res.json(dish.comments.id(req.params.commentId))
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err)
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found')
                    err.status = 404;
                    return next(err)
                }

            }, (err) => { next(err) })
            .catch((err) => { next(err) })

    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    dish.save().then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json')
                        res.json(dish)
                    }, (err) => { next(err) })
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err)
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found')
                    err.status = 404;
                    return next(err)
                }
            }, (err) => { next(err) })
            .catch((err) => { next(err) })

    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    dish.comments.id(req.params.commentId).remove();
                    dish.save().then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json')
                        res.json(dish)
                    }, (err) => { next(err) })
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found')
                    err.status = 404;
                    return next(err)
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found')
                    err.status = 404;
                    return next(err)
                }
            }, (err) => { next(err) })
            .catch((err) => { next(err) })


    });

module.exports = dishRouter;


