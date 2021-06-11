const model = require('../models');

module.exports = {
    create: (req, res) => {
        model.Transaction.create({
            total: req.body.total,
            PaymentMethodId: req.body.paymentmethodid,
            RestaurantId: req.query.restaurantid,
            UserId: req.body.userid,
            Discount: req.body.discount
        }).then(data => {
            req.body.transactionMenus.forEach(element => {
                element.TransactionId = data.id
            });
            model.TransactionMenu.bulkCreate(req.body.transactionMenus)
                .then(data => {
                    res.status(201).json({
                        msg: 'Success'
                    });
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        msg: 'Internal Server Error'
                    })
                });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                msg: 'Internal Server Error'
            });
        });
    },
    findAll: (req, res) => {
        if (!req.query.restaurantid) {
            return res.status(400).json({
                msg: 'Restaurant id required'
            })
        }
        model.Transaction.findAll({
            where: {
                RestaurantId: req.query.restaurantid
            },
            include: [{
                model: model.PaymentMethod
            }, {
                model: model.User,
                attributes: {
                    exclude: ['password']
                }
            }, {
                model: model.TransactionMenu,
                include: [{
                    model: model.Menu
                }]
            }]
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
    findPaymentMethod: (req, res) => {
        model.PaymentMethod.findAll()
            .then(data => {
                res.status(200).json({
                    msg: 'Success',
                    data
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    msg: 'Internal Server Error'
                });
            });
    },
    destroy: (req, res) => {
        model.Transaction.findById(req.query.id)
            .then(data => {
                model.TransactionMenu.findAll({
                    where: {
                        TransactionId: data.id
                    }
                }).then(async transactionMenus => {
                    await transactionMenus.forEach(element => {
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
    getLastId: (req, res) => {
        model.Transaction.findAll({
            limit: 1,
            order: [['createdAt', 'DESC']]
        }).then(data => {
            res.status(200).json({
                msg: 'Success',
                id: data[0].id
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                msg: 'Internal Server Error'
            })
        });
    },
    update: (req, res) => {
        model.Transaction.update(req.body, {
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
}