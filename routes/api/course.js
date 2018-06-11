var express = require('express');
//var jwt = require('jsonwebtoken');
//var md5 = require('md5');
var router = express.Router();
var { auth,
    permit,
} = require('../../functions/authentication');

var Course = require('../../models/course.model');
var User = require('../../models/user.model');
router.get('/:id', function (req, res) {
    Course.find({ 'course_ID': req.params.id }, 'courseName', function (err, data) {
        if (err)
            return res.send({
                status: 'error',
                error: err
            });
        return res.send({
            status: 'success',
            data: {
                course: data
            }
        });
    })
});

router.get('/', function (req, res) {
    Course.find({}).then(function (course) {
        res.send({
            status: 'success',
            data: {
                course: course
            }
        });
    }).catch(function (err) {
        res.send({
            status: "error",
            error: err
        });
    })
});

router.delete('/:id', auth, permit('teacher'), function (req, res) {

    Course.findOne({ course_ID: req.params.id }, function (err, data) {
        if (err)
            return res.send({
                status: 'error',
                error: err
            });
        if (data)
            if (data.teacher_ID == req.user._id)
                Course.findOneAndRemove({ course_ID: req.params.id }).then(function (course) {
                    var id = req.params.id;
                    res.send({
                        status: 'success',
                        data: { message: 'course ' + id + ' is deleted' }
                    });
                }).catch(function (err) {
                    res.send({
                        status: 'error',
                        error: err
                    })
                });
            else res.send({
                status: 'error',
                data: { message: 'Access is denied' }

            });
        else res.send({
            status: 'error',
            data: { message: 'course is not found' }
        });
    });
});
router.post('/', auth, permit('teacher'), async function (req, res) {
    try {
        let course = new Course();
        course.courseName = req.body.courseName;
        course.course_ID = req.body.course_ID;
        course.teacher_ID = req.body.teacher_ID;
        await course.save();
        res.send({
            status: 'success',
            data: {
                message: 'your course is added :)'
            }
        })
    } catch (error) {
        res.send({
            status: 'error',
            error: error
        })
    }
});

router.post('/editName/:id', auth, permit('teacher'), function (req, res) {
    Course.findOne({ course_ID: req.params.id }, function (err, data) {
        if (err)
            return res.send({
                status: 'error',
                error: err
            });
        if (data)
            if (data.teacher_ID == req.user._id)
                Course.update({ course_ID: req.params.id }, { $set: { courseName: req.body.courseName } }).then(function (course) {
                    var id = req.params.id;
                    res.send({
                        status: 'success',
                        data: { message: 'course ' + id + ' is Edited' }
                    });
                }).catch(function (err) {
                    res.send({
                        status: 'error',
                        error: err
                    })
                });
            else res.send({
                status: 'error',
                data: { message: 'Access is denied' }

            });
        else res.send({
            status: 'error',
            data: { message: 'course is not found' }
        });
    });
});

router.post('/changeTeacher/:id', auth, permit('teacher'), function (req, res) {
    Course.findOne({ course_ID: req.params.id }, function (err, data) {
        if (err)
            return res.send({
                status: 'error',
                error: err
            });
        if (data)
            if (data.teacher_ID == req.user._id)
                Course.update({ course_ID: req.params.id }, { $set: { teacher_ID: req.body.teacher_ID } }).then(function (course) {
                    var id = req.params.id;
                    res.send({
                        status: 'success',
                        data: { message: 'course ' + id + ' is Edited' }
                    });
                }).catch(function (err) {
                    res.send({
                        status: 'error',
                        error: err
                    })
                });
            else res.send({
                status: 'error',
                data: { message: 'Access is denied' }

            });
        else res.send({
            status: 'error',
            data: { message: 'course is not found' }
        });
    });
});
module.exports = router;