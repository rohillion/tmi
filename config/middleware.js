var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

var verifyHandler = function (token, tokenSecret, profile, done) {
    process.nextTick(function () {
        console.log(profile);
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
                    location: '',
                    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '' ,
                    picture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : ''
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
            var FACEBOOK_CALLBACK_URL = local.FACEBOOK_CALLBACK_URL;

            passport.use(new FacebookStrategy({
                    clientID: FACEBOOK_APP_ID,
                    clientSecret: FACEBOOK_APP_SECRET,
                    callbackURL: FACEBOOK_CALLBACK_URL + "/auth/facebook/callback",
                    enableProof: false,
                    profileFields: ['id', 'displayName', 'emails', 'picture.type(large)']
                },
                verifyHandler
            ));

            app.use(passport.initialize());
            app.use(passport.session());
        }
    }

};