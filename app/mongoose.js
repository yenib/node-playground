const config = require('../config');
const mongoose = require('mongoose');

const Subscription = require('./models/subscription');

mongoose.connect(config.db.connectStr);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
    console.log('Connection Error: ' + err);
});


exports.addSubscription = (name, email, locale, successCb, errorCb) => {
    const subscription = new Subscription({
        name: name,
        email: email,
        locale: locale
    });
    subscription.save((err, results) => {
        if(err) {
            console.log('Database Error: ' + err);
            if (err.code === 11000) { // MongoDB E11000 duplicate key error collection
                errorCb('DUPLICATED'); // TODO: encapsulate error codes for database errors
                return;
            }
            errorCb('OTHER');
        } else {
            successCb(results);
        }
    });
};