const mongoose = require('mongoose');
const config = require('../../config');

const subscriptionSchema = mongoose.Schema({
    name: {type: String, max: 100, default: ''},
    email: {type: String, required: true, unique: true, max: 100},
    locale: {type: String, enum: config.app.translations, default: config.app.translationsDefault},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Subscription', subscriptionSchema);