var config = require('../repositories/configurationRepository');

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var session = require('express-session');
var cookieParser = require('cookie-parser');

var Admin = require('../models/admin');
var adminService = require('../services/adminService');

var ObjectId = require('mongodb').ObjectID;

module.exports = function (app, logger) {
    passport.serializeUser(function(user, done) {
        done(null, user.google.id);
    });

    passport.deserializeUser(function(id, done) {
        adminService.getOne(
            { 'google.id': id },
            function (err, usr) {
                if (err) {
                    logger.error('Error while trying to deserialize user with id - %s', id + '');
                }

                done(err, usr);
            });
    });

    // Use the GoogleStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Google
    //   profile), and invoke a callback with a user object.
    passport.use(
        new GoogleStrategy({
            clientID: config.keys.google['client_id'],
            clientSecret: config.keys.google['client_secret'],
            callbackURL: config.main.googleAuthCallbackUrl
        },
        function (req, token, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {
                adminService.getOne(
                    { 'google.id': profile.id },
                    function (err, usr) {
                        if (err) {
                            logger.error('Error while trying to get user from database - %j', err);

                            return done(err);
                        }

                        if (usr) {
                            usr.google.token = token;

                            adminService.upsertOne(usr, function (err) {
                                if (err) {
                                    logger.error('Error while trying to upsert user into database - %j', err);

                                    return done(err);
                                }

                                done(null, usr);
                            });
                        } else {
                            var newUser = new Admin({
                                _id: new ObjectId(),
                                google: {
                                    id: profile.id,
                                    token: token,
                                    name: profile.displayName,
                                    email: profile.emails[0].value
                                }
                            });

                            adminService.upsertOne(newUser, function (err) {
                                if (err) {
                                    logger.error('Error while trying to upsert user into database - %j', err);

                                    return done(err);
                                }

                                done(null, newUser);
                            });
                        }
                    });
            });
        }
    ));
    
    app.use(cookieParser());
    app.use(session({
        secret: config.keys.website['session_secret']
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    /*app.get('/login', function(req, res){
        res.render('login', { user: req.user });
    });*/

    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve
    //   redirecting the user to google.com.  After authorization, Google
    //   will redirect the user back to this application at /auth/google/callback
    app.get('/auth/google',
        passport.authenticate('google', { 
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'
            ] 
        }),
        function(req, res){
            // The request will be redirected to Google for authentication, so this
            // function will not be called.
        });

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get('/auth/google/callback', 
        passport.authenticate('google', { failureRedirect: '/?login=failed' }),
        function(req, res) {
            res.redirect('/');
        });

    /*app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });*/
};
