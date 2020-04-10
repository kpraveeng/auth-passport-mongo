const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');
const { JWT_SECRET } = require('./configuration');

//JSON WEB TOKEN STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try{
        // Find the user specified in token
        const user = await User.findById(payload.sub);

        // If user does not exist, handle it
        if(!user) {
            return done(null, false);
        }

        //Otherwise, return the user
        done(null, user);

    }catch(error) {
        done(error,false);
    }

}));

//LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
    //Find the User given the email
    const user = await User.findOne({ email });

    //If not, handle it
    if(!user) { 
        return done(null, false);
    }
    //Check if the password is correct
    const isMatch = await user.isValidPassword(password);
    //If not handle it
    if(!isMatch) {
        return done(null, false);
    }
    //Otherwise, return user
        done(null, user);
    }catch (error) {
        done(error, false);
    }
}))
