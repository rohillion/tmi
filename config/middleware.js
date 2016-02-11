var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;
//GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var verifyHandler = function (token, tokenSecret, profile, done) {
    process.nextTick(function () {

        User.findOne({
            uid: profile.id
        }, function (err, user) {
            if (user) {
                return done(null, user);
            } else {
                User.create({
                    provider: profile.provider,
                    uid: profile.id,
                    name: profile.displayName,
                    admin: false,
                    location: ''
                }, function (err, user) {
                    return done(err, user);
                });
            }
        });
    });
};

passport.serializeUser(function (user, done) {
    done(null, user.uid);
});

passport.deserializeUser(function (uid, done) {
    User.findOne({
        uid: uid
    }, function (err, user) {
        done(err, user)
    });
});


module.exports = {

    // Init custom express middleware
    express: {
        customMiddleware: function (app) {

            var local = require('./env/'+ sails.config.environment +'.js');
            
            // Configure with your credentials
            var FACEBOOK_APP_ID = local.FACEBOOK_APP_ID;
            var FACEBOOK_APP_SECRET = local.FACEBOOK_APP_SECRET;
            var FACEBOOK_CALLBACK_URL = local.FACEBOOK_APP_SECRET;

            //var GOOGLE_CLIENT_ID = local.GOOGLE_CLIENT_ID;
            //var GOOGLE_CLIENT_SECRET = local.GITHUB_CLIENT_SECRET;

            passport.use(new FacebookStrategy({
                    clientID: FACEBOOK_APP_ID,
                    clientSecret: FACEBOOK_APP_SECRET,
                    callbackURL: FACEBOOK_CALLBACK_URL + "/auth/facebook/callback",
                    enableProof: false
                },
                verifyHandler
            ));

            /*passport.use(new GoogleStrategy({
                    clientID: GOOGLE_CLIENT_ID,
                    clientSecret: GOOGLE_CLIENT_SECRET,
                    callbackURL: 'http://localhost:1337/auth/google/callback'
                },
                verifyHandler
            ));*/

            app.use(passport.initialize());
            app.use(passport.session());
        }
    }

};