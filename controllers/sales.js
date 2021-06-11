const model = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    summary: (req, res) => {
        const inputCategoryId = req.query.categoryid.split(',');
        if(!req.query.categoryid) {
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
                    include: [{
                        model: model.Menu,
                        include: [{
                            model: model.Category
                        }]
                    }]
                }]
            }).then(data => {
                let sum = 0;
                for (let i = 0; i < data.length; i++) {
                    sum += data[i].dataValues.total;
                }
                let arr = [];
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < data[i].dataValues.TransactionMenus.length; j++) {
                        if (arr.length === 0) {
                            arr.push({
                                id: data[i].dataValues.TransactionMenus[j].Menu.id,
                                name: data[i].dataValues.TransactionMenus[j].Menu.name,
                                category: data[i].dataValues.TransactionMenus[j].Menu.Category.name,
                                count: 1
                            })
                        } else {
                            let has = false;
                            for (let k = 0; k < arr.length; k++) {
                                if (data[i].dataValues.TransactionMenus[j].Menu.id === arr[k].id) {
                                    has = true;
                                    arr[k].count++;
                                }
                            }
                            if (!has) {
                                arr.push({
                                    id: data[i].dataValues.TransactionMenus[j].Menu.id,
                                    name: data[i].dataValues.TransactionMenus[j].Menu.name,
                                    category: data[i].dataValues.TransactionMenus[j].Menu.Category.name,
                                    count: 1
                                })
                            }
                        }
                    }
                }
                let topSales = [];
                for (let i = 0; i < arr.length; i++) {
                    if (i === 0) {
                        topSales.push(arr[i]);
                    } else {
                        let have = false;
                        for (let j = 0; j < topSales.length; j++) {
                            if(arr[i].category == topSales[j].category){
                                if(arr[i].count > topSales[j].count){
                                    topSales.splice(j, 1, arr[i])
                                }
                                have = true;
                            }
                        }
                        if(!have){
                            topSales.push(arr[i]);
                        }
                    }
                }
                res.status(200).json({
                    msg: 'Success',
                    data,
                    summary: {
                        totalSales: sum,
                        topSales
                    }
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    msg: 'Internal Server Error'
                })
            });
        } else {
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
                let sum = 0;
                for (let i = 0; i < data.length; i++) {
                    sum += data[i].dataValues.total;
                }
                let arr = [];
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < data[i].dataValues.TransactionMenus.length; j++) {
                        if (arr.length === 0) {
                            arr.push({
                                id: data[i].dataValues.TransactionMenus[j].Menu.id,
                                name: data[i].dataValues.TransactionMenus[j].Menu.name,
                                category: data[i].dataValues.TransactionMenus[j].Menu.Category.name,
                                count: 1
                            })
                        } else {
                            let has = false;
                            for (let k = 0; k < arr.length; k++) {
                                if (data[i].dataValues.TransactionMenus[j].Menu.id === arr[k].id) {
                                    has = true;
                                    arr[k].count++;
                                }
                            }
                            if (!has) {
                                arr.push({
                                    id: data[i].dataValues.TransactionMenus[j].Menu.id,
                                    name: data[i].dataValues.TransactionMenus[j].Menu.name,
                                    category: data[i].dataValues.TransactionMenus[j].Menu.Category.name,
                                    count: 1
                                })
                            }
                        }
                    }
                }
                let topSales = [];
                for (let i = 0; i < arr.length; i++) {
                    if (i === 0) {
                        topSales.push(arr[i]);
                    } else {
                        let have = false;
                        for (let j = 0; j < topSales.length; j++) {
                            if(arr[i].category == topSales[j].category){
                                if(arr[i].count > topSales[j].count){
                                    topSales.splice(j, 1, arr[i])
                                }
                                have = true;
                            }
                        }
                        if(!have){
                            topSales.push(arr[i]);
                        }
                    }
                }
                res.status(200).json({
                    msg: 'Success',
                    data,
                    summary: {
                        totalSales: sum,
                        topSales
                    }
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    msg: 'Internal Server Error'
                })
            });
        }
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
    }
}