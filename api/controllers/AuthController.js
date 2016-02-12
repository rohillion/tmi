/**
 * AuthController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

var passport = require('passport');

var AuthController = {

    index: function (req, res) {
        res.view();
    },

    logout: function (req, res) {
        req.logout();
        res.redirect('/');
    },

    'facebook': function (req, res) {
        console.log('A');
        passport.authenticate('facebook', {
                //failureRedirect: '/login',
                scope: 'email'
            },
            function (err, user) {
            console.log('vuelve A');
                req.logIn(user, function (err) {
                    if (err) {
                        console.log(err);
                        res.view('500');
                        return;
                    }

                    res.redirect('/');
                    return;
                });
            })(req, res);
    },

    'facebook/callback': function (req, res) {
        console.log('B');
        passport.authenticate('facebook',
            function (req, res) {
            console.log('vuelve B');
                res.redirect('/');
            })(req, res);
    },

    'session': function (req, res) {
        if(req.isAuthenticated())
            return res.json(req.user);
        return res.json({});
    }

};
module.exports = AuthController;