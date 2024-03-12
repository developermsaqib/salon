// const googleStrategy = require('passport-google-oauth2').Strategy;
// const { CLIENTID, CLIENTSECRET,CALLBACKURL } = process.env;
// const passport = require('passport');
// const { userServices } = require('../api/services');

// module.exports = (passport)=>{
//       passport.use(new googleStrategy({
//         clientID: CLIENTID,
//         clientSecret: CLIENTSECRET,
//         callbackURL:CALLBACKURL,
//         passReqToCallback:true,
//       },async (request, accessToken, refreshToken, profile, done) => {
//         try {
//             console.log('profile=>>>',profile);
//             let existingUser = await userServices.findOne({ 'google.id': profile.id });
//             if (existingUser) {
//                 return done(null, existingUser);
//             }
            
//             console.log('Creating new user...');
                    
//             const newUser = await userServices.create({
//                 method: 'google',
//                 google: {
//                 id: profile.id,
//                 name: profile.displayName,
//                 email: profile.emails[0].value
//             }
//             });
            
//             return done(null, newUser);
//         } catch (error) {
//         return done(error, false)
//         }
//         }))
// }