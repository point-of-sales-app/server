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
            created_at: new Date().toDateString(),
            updated_at: new Date().toDateString(),
            RoleId: 1
        })
            .then(data => {
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
            created_at: new Date().toDateString(),
            updated_at: new Date().toDateString(),
            RoleId: 2
        })
            .then(data => {
                model.UserRestaurant.create({
                    UserId: data.id,
                    RoleId: data.RoleId,
                    RestaurantId: req.query.restaurant_id
                }).then(conjuction => {
                    res.status(201).json({
                        msg: 'Success',
                        conjuction,
                        data
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
    }
}
