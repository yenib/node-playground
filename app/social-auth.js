const config = require('../config');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


module.exports = (passport) => {
    passport.use(new GoogleStrategy({
            clientID: config.apis.googleClientId,
            clientSecret: config.apis.googleClientSecret,
            callbackURL: config.apis.googleCallbackUrl
        },
        (accessToken, refreshToken, profile, done) => {
            // nothing to verify here.
            return done(null, {
                profile: profile,
                accessToken: accessToken
            });
        }));
};