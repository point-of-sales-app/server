const model = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    login: (req, res) => {
        model.User.findOne({
            where: { email: req.body.email }
        })
            .then(data => {
                if (data) {
                    let check = bcrypt.compareSync(req.body.password, data.password);
                    if (check) {
                        const token = jwt.sign({ id: data.id, name: data.name, role: data.RoleId }, process.env.JWT_SECRET);
                        if(data.RoleId === 2 || data.RoleId === 3) {
                            model.UserRestaurant.findOne({
                                where: {
                                    UserId: data.id
                                },
                                include: [{
                                    model: model.Restaurant
                                }]
                            }).then(restaurant => {
                                console.log(restaurant.Restaurant)
                                res.status(200).json({
                                    msg: 'Login Success',
                                    user: {
                                        id: data.id,
                                        email: data.email,
                                        name: data.name,
                                        role: data.RoleId,
                                        token: token
                                    },
                                    restaurant: restaurant.Restaurant
                                })
                            })
                        } else {
                            res.status(200).json({
                                msg: 'Login Success',
                                user: {
                                    id: data.id,
                                    email: data.email,
                                    name: data.name,
                                    role: data.RoleId,
                                    token: token
                                }
                            })
                        }
                    }else {
                        res.status(401).json({
                            msg: 'Bad Credentials'
                        });
                    }
                } else {
                    res.status(404).json({
                        msg: 'User Not Found'
                    })
                }
            })
            .catch(err => {
                res.status(404).json({
                    msg: 'Internal Server Error'
                })
            })
    }
}