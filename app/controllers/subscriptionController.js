const dbService = require('../mongoose');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

module.exports.subscribe = [
    body("name").optional({ checkFalsy: true }).trim().escape(),
    body("email").trim().isEmail().withMessage('Invalid email'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Invalid Parameters: ');
            console.info(errors.array());
            var err = new Error('Invalid Parameters');
            err.status = 422;
            next(err);
            return;
        }

        dbService.addSubscription(
            req.body.name, 
            req.body.email,
            (results) => {
                res.status(201).json({
                    message: "You are subscribed!"
                });
                //TODO: broadcast new subscription
            },
            (dbErr) => {
                let error = new Error();
                if (dbErr === "DUPLICATED") {
                    error.status = 422;
                    error.message = "Already Subscribed";
                } else {
                    error.status = 500;
                    error.message = "Internal Error";
                }
                next(error);
            });
}];