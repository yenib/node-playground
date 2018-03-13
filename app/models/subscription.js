const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
    name: {type: String, max: 100, default: ''},
    email: {type: String, required: true, unique: true, max: 100},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Subscription', subscriptionSchema);