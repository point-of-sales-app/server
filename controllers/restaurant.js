const model = require('../models');

module.exports = {
    create: (req, res) => {
        console.log(req.body)
        if (req.decoded.role !== 1) {
            res.status(400).json({
                msg: 'Unauthorized'
            })
        }
        model.Restaurant.create({
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
            phone: req.body.phone,
            tax: req.body.tax
        }).then(data => {
            model.UserRestaurant.create({
                UserId: req.decoded.id,
                RoleId: req.decoded.role,
                RestaurantId: data.id
            }).then(conjuction => {
                conjuction.dataValues.Restaurant = data;
                res.status(201).json({
                    msg: 'Success',
                    data: conjuction
                });
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                msg: 'Internal Server Error'
            })
        });
    },
    update: (req, res) => {
        model.Restaurant.update(req.body, {
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
        model.Restaurant.findById(req.query.id)
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
    findAll: (req, res) => {
        model.UserRestaurant.findAll({
            where: {
                UserId: req.decoded.id
            },
            include: [{
                model: model.Restaurant
            }]
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
    findById: (req, res) => {
        model.Restaurant.findById(req.query.id)
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
    }
}
