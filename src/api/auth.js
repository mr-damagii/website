var passport = require('passport');
var passportGoogleOauth = require('passport-google-oauth');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongodb = require('mongodb');
var config = require('../stores/configuration');
var adminStore = require('../stores/admin');
var Admin = require('../core/admin');

var GoogleStrategy = passportGoogleOauth.OAuth2Strategy;
var ObjectId = mongodb.ObjectID;

module.exports = function (server, logger) {
    passport.serializeUser(function(user, done) {
        done(null, user.google.id);
    });

    passport.deserializeUser(function(id, done) {
        adminStore.getOne(
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
            clientID: config.keys.google.client_id,
            clientSecret: config.keys.google.client_secret,
            callbackURL: config.main.googleAuthCallbackUrl
        },
        function (req, token, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {
                adminStore.getOne(
                    { 'google.id': profile.id },
                    function (err, usr) {
                        if (err) {
                            logger.error('Error while trying to get user from database - %j', err);

                            return done(err);
                        }

                        if (usr) {
                            usr.google.token = token;

                            adminStore.upsertOne(usr, function (err) {
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

                            adminStore.upsertOne(newUser, function (err) {
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
    
    server.use(cookieParser());
    server.use(session({
        secret: config.keys.website.session_secret
    }));
    server.use(passport.initialize());
    server.use(passport.session());

    /*server.get('/login', function(req, res){
        res.render('login', { user: req.user });
    });*/

    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve
    //   redirecting the user to google.com.  After authorization, Google
    //   will redirect the user back to this application at /auth/google/callback
    server.get('/auth/google',
        passport.authenticate('google', { 
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'
            ] 
        }),
        function () {
            // The request will be redirected to Google for authentication, so this
            // function will not be called.
        });

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    server.get('/auth/google/callback', 
        passport.authenticate('google', { failureRedirect: '/?login=failed' }),
        function (req, res) {
            res.redirect('/');
        });

    /*server.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });*/
};