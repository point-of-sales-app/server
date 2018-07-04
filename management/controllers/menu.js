const model = require('../models');

module.exports = {
    create: (req, res) => {
        if(!req.query.restaurantid) {
            return res.status(400).json({
                msg: 'Restaurant id required'
            })
        }
        model.Menu.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            RestaurantId: req.query.restaurantid
        }).then(data => {
            res.status(201).json({
                msg: 'Success',
                data
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                msg: 'Internal Server Error',
            })
        })
    },
    findAll: (req, res) => {
        if(!req.query.restaurantid) {
            return res.status(400).json({
                msg: 'Restaurant id required'
            })
        }
        model.Menu.findAll({
            where: {
                RestaurantId: req.query.restaurantid
            }
        }).then(data => {
            res.status(200).json({
                msg: 'Success',
                data
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                msg: 'Internal Server Error'
            })
        });
    },
    findById: (req, res) => {
        model.Menu.findById(req.query.id)
            .then(data => {
                res.status(200).json({
                    msg: 'Success',
                    data
                })
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    msg: 'Internal Server Error'
                })
            });
    },
    update: (req, res) => {
        model.Menu.update(req.body, {
            where: {
                id: req.query.id
            }
        }).then(data => {
            res.status(200).json({
                msg: 'Success',
                data
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                msg: 'Internal Server Error'
            })
        });
    },
    destroy: (req, res) => {
        model.Menu.findById(req.query.id)
            .then(data => {
                data.destroy()
                res.status(200).json({
                    msg: 'Success',
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    msg: 'Internal Server Error'
                })
            });
    },
}