import passport from "passport";
import ppjwt from 'passport-jwt'
import ppggo2 from 'passport-google-oauth2'
import ppfb from 'passport-facebook'



const JwtStrategy = ppjwt.Strategy
const ExtractJWT = ppjwt.ExtractJwt
const GoogleStrategy = ppggo2.Strategy
const FacebookStrategy = ppfb.Strategy

import keys from './keys.js'
import {EMAIL_PROVIDER} from '../constants/index.js'

import User from '../models/user.js'
const secret= keys.jwt.secret

const opts = {}
opts.jwtFromrequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret

passport.use(
    new JwtStrategy(opts, (payload, done) =>{
        User.findById(payload.id)
        .then(user => {
            if(user){
                return done(null, user)
            }
            return done(null, false)
        })
        .catch(err =>{
           return done(err, false) 
        })
    })
)

export const passPort = async app =>{
    app.use(passport.initialize())

    await googleAuth();
    await facebookAuth();
}

const googleAuth = async ()=>{
    try{
        passport.use(
            new GoogleStrategy(
                {
                    clientID: google.clientID,
                    clientSecret: google.clientSecret,
                    callbackURL: `${clientURL}/${apiURL}/${google.callbackURL}`
                },
                (accessToken, refreshToken, profile, done) =>{
                    User.findById({email: profile.email})
                    .then(user =>{
                        if(user){
                            return done(null, user)
                        }
                        const name = profile.displayName.split(' ')

                        const newUser = new User({
                            provider: EMAIL_PROVIDER.Google,
                            googleId: profile.id,
                            email: profile.email,
                            fname: name[0],
                            lname: name[1],
                            avatar: profile.picture,
                            password: null
                        })

                        newUser.save((err, user) =>{
                            if(err) {
                                return done(err, false)
                            }
                            return done(err, user)
                        })
                    })
                    .catch(err =>{
                        return done(err, false)
                    })
                }
            )
        )
    } catch(error){
        console.log('Missing google keys')
    }
}

const facebookAuth = async () => {
    try {
      passport.use(
        new FacebookStrategy(
          {
            clientID: facebook.clientID,
            clientSecret: facebook.clientSecret,
            callbackURL: `${clientURL}/${apiURL}/${facebook.callbackURL}`,
            profileFields: [
              'id',
              'displayName',
              'name',
              'emails',
              'picture.type(large)'
            ]
          },
          (accessToken, refreshToken, profile, done) => {
            User.findOne({ facebookId: profile.id })
              .then(user => {
                if (user) {
                  return done(null, user);
                }
  
                const newUser = new User({
                  provider: EMAIL_PROVIDER.Facebook,
                  facebookId: profile.id,
                  email: profile.emails ? profile.emails[0].value : null,
                  firstName: profile.name.givenName,
                  lastName: profile.name.familyName,
                  avatar: profile.photos[0].value,
                  password: null
                });
  
                newUser.save((err, user) => {
                  if (err) {
                    return done(err, false);
                  }
  
                  return done(null, user);
                });
              })
              .catch(err => {
                return done(err, false);
              });
          }
        )
      );
    } catch (error) {
      console.log('Missing facebook keys');
    }
  };