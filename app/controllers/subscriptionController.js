const database = require("../mysql");
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


module.exports.subscribe = [
    body("name").optional({ checkFalsy: true }).trim().escape(),
    body("email").isEmail().withMessage('Invalid email'),
    (req, res, next) => {//poner valor por defecto a name
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.info(errors.array()); //suficiente info? no haria falta fecha y demas?
            var err = new Error('Invalid Parameters');
            err.status = 422;
            next(err);
        }

        database.addEmail(
            req.body.name, 
            req.body.email,
            (results) => {
                res.status(201).json({
                    message: "You are subscribed!"
                });
                //broadcast
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