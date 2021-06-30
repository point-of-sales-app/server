const model = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { QueryTypes } = require('sequelize');
const db = require('../models/index')

module.exports = {
    data: (req, res) => {
        let whereClause = {
            RestaurantId: req.query.restaurantid,
            createdAt: {
                [Op.gte]: req.query.from,
                [Op.lte]: req.query.to
            }
        }
        if (req.query.categoryid) {
            whereClause = {
                RestaurantId: req.query.restaurantid,
                createdAt: {
                    [Op.gte]: req.query.from,
                    [Op.lte]: req.query.to
                },
                [Op.and]: [db.sequelize.literal(`
                    exists (
                        SELECT TransactionMenus.id 
                        FROM TransactionMenus 
                        JOIN Menus ON TransactionMenus.MenuId = Menus.id 
                        JOIN Categories ON Menus.CategoryId = Categories.id 
                        WHERE TransactionMenus.TransactionId = Transaction.id 
                        AND Categories.id IN (${req.query.categoryid}))`)]
            }
        }
        const page = Number(req.query.page || 1);
        const limit = 10;
        const offset = (page - 1) * limit;

        model.Transaction.findAndCountAll({
            distinct: true,
            where: whereClause,
            order: [
                ['createdAt', 'DESC']
            ],
            include: [{
                model: model.TransactionMenu,
                required: false,
                include: [{
                    model: model.Menu,
                    include: [{
                        model: model.Category
                    }]
                }]
            }],
            limit: limit,
            offset: offset
        }).then(data => {
            // let totalGross = 0;
            // let totalDiscount = 0;
            // if (data.length) {
            //     for (const item of data) {
            //         totalGross += item.total
            //         totalDiscount += item.Discount
            //     }
            // }
            // const totalNett = totalGross - totalDiscount
            // if (req.query.categoryid) {
            //     model.Transaction.count({
            //         distinct: true,
            //         where: {
            //             RestaurantId: req.query.restaurantid,
            //             createdAt: {
            //                 [Op.gte]: req.query.from,
            //                 [Op.lte]: req.query.to
            //             }
            //         },
            //         order: [
            //             ['createdAt', 'DESC']
            //         ],
            //         include: [{
            //             model: model.TransactionMenu,
            //             required: true,
            //             include: [{
            //                 model: model.Menu,
            //                 include: [{
            //                     model: model.Category
            //                 }]
            //             }]
            //         }]
            //     }).then(count => {
            //         res.status(200).json({
            //             msg: 'Success',
            //             data,
            //             meta: {
            //                 page,
            //                 limit,
            //                 offset,
            //                 totalRow: count,
            //                 totalPage: Math.ceil(count / limit)
            //             },
            //             count
            //             // summary: {
            //             //     totalGross,
            //             //     totalDiscount,
            //             //     totalNett
            //             // }
            //         });
            //     }).catch(err => {
            //         console.log(err);
            //         res.status(500).json({
            //             msg: 'Internal Server Error'
            //         })
            //     });
            // } else {
            res.status(200).json({
                msg: 'Success',
                data,
                meta: {
                    page,
                    limit,
                    offset,
                    totalRow: data.count,
                    totalPage: Math.ceil(data.count / limit)
                }
                // summary: {
                //     totalGross,
                //     totalDiscount,
                //     totalNett
                // }
            });
            // }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                msg: 'Internal Server Error'
            })
        });
    },
    remove: (req, res) => {
        model.Transaction.destroy({
            where: {
                id: req.query.id
            }
        }).then(dataTR => {
            return model.TransactionMenu.destroy({
                where: {
                    TransactionId: req.query.id
                }
            })
        }).then(dataTRM => {
            res.status(200).json({
                msg: 'success',
                data: dataTRM
            })
        })
    },

    itemSold: (req, res) => {
        let groupBy = ['MenuId'];
        let includeMenu = {
            model: model.Menu,
            required: true
        };
        if (req.query.type && req.query.type == 'category') {
            groupBy = ['Menu.CategoryId']
            includeMenu = {
                model: model.Menu,
                required: true,
                attributes: ['CategoryId'],
                include: [{
                    model: model.Category
                }]
            }
        }
        model.TransactionMenu.findAll({
            attributes: [
                [db.sequelize.fn('sum', db.sequelize.col('qty')), 'itemSold'],
            ],
            group: groupBy,
            order: [
                [db.sequelize.col('itemSold'), 'DESC']
            ],
            include: [
                includeMenu,
                {
                    model: model.Transaction,
                    attributes: [],
                    where: {
                        RestaurantId: req.query.restaurantid
                    }
                }],
            where: {
                createdAt: {
                    [Op.gte]: req.query.from,
                    [Op.lte]: req.query.to
                }
            },
        }).then(data => {
            let totalItemSold = 0;
            if (data.length) {
                for (const item of data) {
                    totalItemSold += Number(item.dataValues.itemSold)
                }
            }
            for (const item of data) {
                item.dataValues.percentage = item.dataValues.itemSold / totalItemSold * 100 / 100
            }
            res.status(200).json({
                msg: 'success',
                data,
                totalItemSold
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json({
                msg: 'Internal Server Error'
            })
        });
    },
    totalByRange: (req, res) => {
        let type;
        switch (req.query.type) {
            case 'hour':
                type = 'HOUR'
                break;
            case 'day':
                type = 'DATE'
                break;
            case 'week':
                type = 'WEEK'
                break;
            case 'month':
                type = 'MONTH'
                break;
            case 'year':
                type = 'YEAR'
                break;
            default:
                type = 'DATE'
        }
        model.Transaction.findAll({
            attributes: [
                [db.sequelize.fn('SUM', db.sequelize.col('total')), 'total'],
                [db.sequelize.fn('SUM', db.sequelize.col('discount')), 'discount'],
                [db.sequelize.fn(`${type}`, db.sequelize.col('createdAt')), 'createdAt']
            ],
            group: [db.sequelize.fn(`${type}`, db.sequelize.col('createdAt'))],
            order: [[db.sequelize.col('createdAt'), 'ASC']],
            where: {
                RestaurantId: req.query.restaurantid,
                createdAt: {
                    [Op.gte]: req.query.from,
                    [Op.lte]: req.query.to
                }
            }
        }).then(data => {
            res.status(200).json({
                msg: 'success',
                data
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json({
                msg: 'Internal Server Error'
            })
        });
    },
    summary: (req, res) => {
        model.Transaction.findAll({
            attributes: [
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'totalTransaction'],
                [db.sequelize.fn('SUM', db.sequelize.col('total')), 'totalGross'],
                [db.sequelize.fn('SUM', db.sequelize.col('discount')), 'totalDiscount'],
            ],
            where: {
                RestaurantId: req.query.restaurantid,
                createdAt: {
                    [Op.gte]: req.query.from,
                    [Op.lte]: req.query.to
                }
            }
        }).then(data => {
            data[0].dataValues.totalGross = Number(data[0].dataValues.totalGross) || 0;
            data[0].dataValues.totalDiscount = Number(data[0].dataValues.totalDiscount) || 0;
            data[0].dataValues.totalNett = data[0].dataValues.totalGross - data[0].dataValues.totalDiscount
            res.status(200).json({
                msg: 'success',
                data
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json({
                msg: 'Internal Server Error'
            })
        });
    },
    byCategory: (req, res) => {
        if (!req.query.categoryid) {
            return res.status(400).json({
                msg: 'bad request'
            })
        }
        const inputCategoryId = req.query.categoryid.split(',')
        model.Transaction.findAll({
            where: {
                RestaurantId: req.query.restaurantid,
                createdAt: {
                    [Op.gte]: req.query.from,
                    [Op.lte]: req.query.to
                }
            },
            order: [
                ['createdAt', 'DESC']
            ],
            include: [{
                model: model.TransactionMenu,
                required: true,
                include: [{
                    model: model.Menu,
                    include: [{
                        model: model.Category
                    }],
                    where: {
                        categoryId: {
                            [Op.in]: inputCategoryId
                        }
                    }
                }]
            }]
        }).then(data => {
            let total = 0;
            let qty = 0;
            if (data.length) {
                for(const item of data){
                    for(const tr of item.TransactionMenus) {
                        total += tr.qty * tr.Menu.price;
                        qty += tr.qty;
                    }
                }
            }
            res.status(200).json({
                msg: 'success',
                summary: {
                    total,
                    qty
                },
                data
            })
        }).catch(err => {
            console.log(err)
            res.status(500).json({
                msg: 'Internal Server Error'
            })
        });
    }
}