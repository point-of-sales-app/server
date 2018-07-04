const model = require('../models');

module.exports = {
    create: async (req, res) => {
        await req.body.items.forEach(element => {
            element.RestaurantId = req.query.restaurantid      
        });
        model.Expense.bulkCreate(req.body.items)
            .then(data => {
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
        if(!req.query.restaurantid) {
            return res.status(400).json({
                msg: 'Restaurant id required'
            })
        }
        model.Expense.findAll({
            where: { RestaurantId: req.query.restaurantid },
            include: [
                {model: model.Item}
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
    }
}