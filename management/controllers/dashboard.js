const model = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

module.exports = {
    profit: (req, res) => {
        model.Transaction.sum('total', {
            where: {
                RestaurantId: req.query.restaurantid,
                createdAt: {
                    [Op.gte]: req.query.from,
                    [Op.lte]: req.query.to
                }
            }
        }).then(sales => {
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
                let expense = 0;
                for (let i = 0; i < data.length; i++) {
                    expense += data[i].dataValues.totalPrice;
                }
                let profit = 0;
                if (sales !== 0 && expense !== 0) {
                    profit = sales - expense;
                }
                res.status(200).json({
                    msg: 'Success',
                    sales,
                    expense,
                    profit
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
            })
        });
    },
    totalTransaction: (req, res) => {
        model.Transaction.count({
            where: {
                RestaurantId: req.query.restaurantid,
                createdAt: {
                    [Op.gte]: req.query.from,
                    [Op.lte]: req.query.to
                }
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
    graph: (req, res) => {
        model.Transaction.findAll({
            attributes: ['total', 'createdAt'],
            where: {
                RestaurantId: req.query.restaurantid,
                createdAt: {
                    [Op.gte]: req.query.from,
                    [Op.lte]: req.query.to
                }
            }
        }).then(sales => {
            model.Expense.findAll({
                attributes: ['price', 'createdAt'],
                where: {
                    RestaurantId: req.query.restaurantid,
                    createdAt: {
                        [Op.gte]: req.query.from,
                        [Op.lte]: req.query.to
                    }
                }
            }).then(expense => {
                var month = sales.reduce(function (acc, item) {
                    let month = moment(item.createdAt).month() + 1;
                    if (typeof acc[month] === 'undefined') {
                        acc[month] = [];
                    }
                    acc[month].push({
                        mount: item.total,
                        date: item.createdAt
                    });
                    return acc;
                }, {});
                let salesArr = [];
                for (let i = 0; i < Object.keys(month).length; i++) {
                    let count = 0;
                    for (let j = 0; j < Object.entries(month)[i][1].length; j++) {
                        count += Object.entries(month)[i][1][j].mount;
                    }
                    salesArr.push({
                        month: moment(Object.entries(month)[i][1][0].date).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                        total: count
                    });
                }

                var expense = expense.reduce(function (acc, item) {
                    let month = moment(item.createdAt).month() + 1;
                    if (typeof acc[month] === 'undefined') {
                        acc[month] = [];
                    }
                    acc[month].push({
                        mount: item.price,
                        date: item.createdAt
                    });
                    return acc;
                }, {});
                let expenseArr = [];
                for (let i = 0; i < Object.keys(expense).length; i++) {
                    let count = 0;
                    for (let j = 0; j < Object.entries(expense)[i][1].length; j++) {
                        count += Object.entries(expense)[i][1][j].mount;
                    }
                    expenseArr.push({
                        month: moment(Object.entries(expense)[i][1][0].date).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                        total: count
                    });
                }
                res.status(200).json({
                    msg: 'Success',
                    sales: {
                        sales: salesArr,
                        expense: expenseArr
                    }
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
            })
        });
    }
}