const model = require('../models');

module.exports = {
    create: (req, res) => {
        if(!req.query.restaurantid) {
            return res.status(400).json({
                msg: 'Restaurant id required'
            })
        }
        model.Item.create({
            name: req.body.name,
            brand: req.body.brand,
            RestaurantId: req.query.restaurantid,
            UnitId: req.body.UnitId
        }).then(async data => {
            const unit = await model.Unit.findById(data.UnitId);
            data.dataValues.Unit = unit.dataValues;
            console.log(data)
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
        model.Item.update(req.body, {
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
        model.Item.findById(req.query.id)
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
        model.Item.findAll({
            where: { RestaurantId: req.query.restaurantid },
            include: [
                {model: model.Unit}
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
    findById: (req, res) => {
        model.Item.findById(req.query.id,{
            include: [
                {model: model.Unit}
            ]})
            .then(data => {
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
    findUnit: (req, res) => {
        model.Unit.findAll()
            .then(data => {
                res.status(200).json({
                    msg: 'Success',
                    data
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    msg: 'Internal Server Error'
                })
            })
    }
}