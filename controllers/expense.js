const model = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    create: (req, res) => {
        if(!req.query.restaurantid) {
            return res.status(400).json({
                msg: 'Restaurant id required'
            })
        }
        req.body.RestaurantId = req.query.restaurantid;
        model.Expense.create(req.body)
            .then(async data => {
                const item = await model.Item.findById(data.ItemId);
                data.dataValues.totalPrice = data.price * data.qty;
                data.dataValues.Item = item
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
    },
    update: (req, res) => {
        model.Expense.update(req.body, {
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
        model.Expense.findById(req.query.id)
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
        if (!req.query.restaurantid) {
            return res.status(400).json({
                msg: 'Restaurant id required'
            })
        }
        model.Expense.findAll({
            where: { RestaurantId: req.query.restaurantid },
            include: [
                { model: model.Item }
            ]
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
    findDate: (req, res) => {
        model.Expense.findAll({
            where: {
                RestaurantId: req.query.restaurantid,
                createdAt: {
                    [Op.gte]: req.query.from,
                    [Op.lte]: req.query.to
                }
            },
            include: [{
                model: model.Item
            }],
        }).then(async data => {
            await data.map(element => {
                element.dataValues.totalPrice = element.price * element.qty;
            });
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
                sum += data[i].dataValues.totalPrice;
            }
            res.status(200).json({
                msg: 'Success',
                sum,
                data
            });
        }).catch(err => {
            console.log(err)
        });
    }
}