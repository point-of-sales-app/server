const model = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 13;

module.exports = {
    register: (req, res) => {
        let salt = bcrypt.genSaltSync(saltRounds);
        let hash = bcrypt.hashSync(req.body.password, salt);
        model.User.create({
            email: req.body.email,
            password: hash,
            name: req.body.name,
            RoleId: 1
        })
            .then(data => {
                data.password = 'Hidden'
                res.status(201).json({
                    msg: 'Success',
                    data
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    msg: 'Internal Server Error'
                })
            });
    },
    registerCashier: (req, res) => {
        let salt = bcrypt.genSaltSync(saltRounds);
        let hash = bcrypt.hashSync(req.body.password, salt);
        model.User.create({
            email: req.body.email,
            password: hash,
            name: req.body.name,
            RoleId: 2
        })
            .then(user => {
                user.password = 'Hidden'
                model.UserRestaurant.create({
                    UserId: user.id,
                    RoleId: user.RoleId,
                    RestaurantId: req.query.restaurantid
                }).then(userRestaurant => {
                    model.UserRestaurant.find({
                        where: {
                            UserId: user.id,
                            RestaurantId: req.query.restaurantid,
                            RoleId: user.RoleId,
                        },
                        include: [
                            {
                                model: model.User
                            },
                            {
                                model: model.Role
                            }
                        ]
                    }).then(data => {
                        res.status(201).json({
                            msg: 'Success',
                            data
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            msg: 'Internal Server Error'
                        })
                    });
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    msg: 'Internal Server Error'
                })
            });
    },
    registerStaff: (req, res) => {
        let salt = bcrypt.genSaltSync(saltRounds);
        let hash = bcrypt.hashSync(req.body.password, salt);
        model.User.create({
            email: req.body.email,
            password: hash,
            name: req.body.name,
            RoleId: req.body.roleId
        })
            .then(user => {
                user.password = 'Hidden'
                model.UserRestaurant.create({
                    UserId: user.id,
                    RoleId: user.RoleId,
                    RestaurantId: req.query.restaurantid
                }).then(userRestaurant => {
                    model.UserRestaurant.find({
                        where: {
                            UserId: user.id,
                            RestaurantId: req.query.restaurantid,
                            RoleId: user.RoleId,
                        },
                        include: [
                            {
                                model: model.User
                            },
                            {
                                model: model.Role
                            }
                        ]
                    }).then(data => {
                        res.status(201).json({
                            msg: 'Success',
                            data
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            msg: 'Internal Server Error'
                        })
                    });
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    msg: 'Internal Server Error'
                })
            });
    },
    getUser: (req, res) => {
        model.User.findAll({
            include: [{
                model: model.Role
            }]
        }).then(data => {
            res.status(201).json({
                msg: 'Success',
                data
            });
        })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    msg: 'Internal Server Error'
                })
            });
    },
    updateUser: (req, res) => {
        model.User.update(req.body, {
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
    getStaff: (req, res) => {
        model.UserRestaurant.findAll({
            where: {
                RestaurantId: req.query.restaurantid,
                // RoleId: 2
            },
            include: [
                {
                    model: model.User
                },
                {
                    model: model.Role
                }
            ]
        }).then(data => {
            res.status(200).json({
                msg: 'Success',
                data
            });
        })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    msg: 'Internal Server Error'
                })
            });
    },
    deleteStaff: (req, res) => {
        model.User.findById(req.query.id)
            .then(user => {
                model.UserRestaurant.find({
                    where: {
                        UserId: req.query.id
                    }
                }).then(async userRestaurant => {
                    await userRestaurant.destroy();
                    await user.destroy();
                    res.status(200).json({
                        msg: 'Success'
                    });
                })
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    msg: 'Internal Server Error'
                })
            });
    }
}
