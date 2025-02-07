const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const Auth = require('../models/Auth');

const opts = {
    jwtFromRequest : extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'mySecretKey'
};

passport.use(new jwtStrategy(opts,async (payload,done)=>{
    const isExistUser = await Auth.findById(payload.userData._id);
    if(isExistUser){
        return done(null,isExistUser);
    }else{
        return done(null,false);
    }
}));

passport.serializeUser((user,done)=>{
    return done(null,user.id);
});

passport.deserializeUser( async (id,done)=>{
    const userData = await Auth.findById(id);
    if(userData){
        return done(null,userData);
    }else{
        return done(null,false);
    }
});

module.exports = passport;