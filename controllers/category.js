const model = require('../models');

module.exports = {
    create: (req, res) => {
        if (!req.query.restaurantid) {
            return res.status(400).json({
                msg: 'Restaurant id required'
            })
        }
        model.Category.create({
            name: req.body.name,
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
        if (!req.query.restaurantid) {
            return res.status(400).json({
                msg: 'Restaurant id required'
            })
        }
        model.Category.findAll({
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
        model.Category.findById(req.query.id).then(data => {
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
        model.Category.update(req.body, {
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
        model.Category.findById(req.query.id)
            .then(data => {
                model.Menu.findAll({
                    where: {
                        CategoryId: req.query.id
                    }
                }).then(async menus => {
                    await menus.forEach(element => {
                        element.destroy();
                    });
                    await data.destroy();
                    res.status(200).json({
                        msg: 'Success',
                    });
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    msg: 'Internal Server Error'
                })
            });
    },
}