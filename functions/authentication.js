let jwt = require('jsonwebtoken');
let RateLimit = require('express-rate-limit');

let User = require('../models/user.model');
let config = require('../config');

/**
 * @description SignIn/Up rateLimiter
 * @param {number} windowM minutes - how long to keep records of requests in memory.
 * @param {number} max max number of connections during windowM milliseconds before sending a 429 response.
 */
module.exports.limiter = (windowM, max) => {
    return new RateLimit({
        windowMs: windowM * 60 * 1000,
        max: max,
        delayMs: 0
    })
}

module.exports.auth = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.body.token;
    if (!token) {
        // if there is no token
        // return an error
        return res.status(403).send({
            status: "fail",
            data: {
                message: 'No token provided.'
            }
        });
    } else {
        jwt.verify(token, config.secret_key, async (error, decoded) => {
            try {
                if (error) {
                    return res.status(403).send({
                        status: "fail",
                        data: {
                            message: 'Failed to authenticate token.'
                        }
                    });
                } else {
                    let user = await User.findById(decoded._id);
                    switch (user.status) {
                        case 'inactive':
                            return res.send({
                                status: 'fail',
                                data: {
                                    message: 'your account is inactive.'
                                }
                            });
                            break;
                        case 'block':
                            return res.send({
                                status: 'fail',
                                data: {
                                    message: 'your account is block.'
                                }
                            });
                            break;
                        case 'active':
                            req.user = {
                                _id: decoded._id,
                                role: user.role
                            };
                            next();
                            break;
                    }
                }
            } catch (error) {
                return res.send({
                    status: 'error',
                    error: error
                })
            }
        })
    }
}

/**
 * @description role managment system
 * @param {string[]} roles permited roles
 * @example router.post('/', auth, permit('admin'), (req, res, next) => {})
 */
module.exports.permit = (...roles) => {
    return (req, res, next) => {
        role = req.user.role;
        if (roles.indexOf(role) == -1) {
            return res.send({
                status: 'fail',
                data: {
                    message: 'role rejected.'
                }
            })
        } else {
            next();
        }
    }
}

module.exports.userExist = async (req, res, next) => {
    try {
        let user = await User.findOne({
            username: req.body.username
        });
        if (user) {
            res.send({
                status: 'fail',
                data: {
                    message: 'username already registered.'
                }
            })
        } else {
            next();
        }
    } catch (error) {
        res.send({
            status: "error",
            error: error
        })
    }
}
