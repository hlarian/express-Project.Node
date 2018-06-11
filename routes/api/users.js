var express = require('express');
var jwt = require('jsonwebtoken');
var md5 = require('md5');
var router = express.Router();
var {
  auth,
  permit,
  limiter,
  userExist} = require('../../functions/authentication');
var config = require('../../config');

var User = require('../../models/user.model');

router.post('/signup', limiter(5, 3), userExist, async (req, res) => {
  try {
    let user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.username = req.body.username;
    user.role = req.body.role;
    user.password = req.body.password ? md5(req.body.password) : undefined;
    await user.save();
    res.send({
      status: 'success',
      data: {
        message: 'user account created.'
      }
    })
  } catch (error) {
    res.send({
      status: 'error',
      error: error
    })
  }
});

router.post('/signin', limiter(2, 5), async (req, res) => {
  try {
    let user = await User.findOne({
      username: req.body.username
    });

    if (!user) {
      return res.send({
        status: 'fail',
        data: {
          message: 'username is incorrect.'
        }
      })
    } else {
      if (!req.body.password || user.password != md5(req.body.password)) {
        return res.send({
          status: 'fail',
          data: {
            message: 'password is incorrect.'
          }
        })
      } else {
        let payload = {
          _id: user._id
        }
        let token = jwt.sign(payload, config.secret_key);
        return res.send({
          status: 'success',
          data: {
            token: token
          }
        })
      }
    }
  } catch (error) {
    return res.send({
      status: 'error',
      error: error
    })
  }
});

router.post('/verify', auth, (req, res) => {
  return res.send({
    status: 'success',
    data: {
      user: req.user
    }
  })
});

router.post('/getCourse/:id', auth, permit('student'), function (req, res) {
  Course.update({ course_ID: req.params.id }, { $push: { members: req.body.id } }).then(function (course) {
      User.update({ _id: req.body.id }, { $push: { Course: req.params.id } }).then(function (User) {
          res.send({
              status: 'success',
              data: { message: 'your course is Recorded' }
          })
      }).catch(function (err) {
          res.send({
              status: 'error',
              error: err
          })
      })
  }).catch(function (err) {
      res.send({
          status: 'error',
          error: err
      })
  })
});


module.exports = router;