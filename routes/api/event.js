var express = require('express');
//var jwt = require('jsonwebtoken');
//var md5 = require('md5');
var router = express.Router();
var { auth,
    permit,
} = require('../../functions/authentication');

var Course = require('../../models/course.model');
var Event = require('../../models/event.model');


router.post('/', auth, permit('teacher'), function (req, res) {

    Course.findOne({ course_ID: req.body.course_ID }).then(async function (course) {
        if (req.user._id == course.teacher_ID) {
            var event = Event();
            event.eventName = req.body.eventName;
            event.course_ID = course._id;
            event.description = req.body.description;
            await event.save();
            res.send({
                status: 'success',
                data: { message: 'event is created' }
            })
        } else {
            res.send({
                status: 'error',
                error: 'Access is denied'
            })
        }
    }).catch(function (err) {
        res.send({
            status: 'error',
            error: err
        })
    });


});
router.get('/:id', function (req, res) {

    Course.findOne({ course_ID: req.params.id }).then(function (course) {

        Event.find({ course_ID: course._id }).then(function (event) {
            res.send({
                status: "success",
                data: event
            })
        }).catch(function (err) {
            res.send({
                status: "success",
                error: err
            })
        });

    }).catch(function (err) {
        res.send({
            status: "success",
            error: err
        })
    });

});

module.exports = router;