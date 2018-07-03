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
                        const token = jwt.sign({ id: data.id, role: data.RoleId }, process.env.SECRETKEY);
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
                console.log(err);
                res.status(500).json({
                    msg: 'Internal Server Error'
                })
            })
    }
}