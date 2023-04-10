//LOGIN AUTHENTICATION USING PASSPORT DEPENDENCIES

const Localauthenticate = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
    // FUNCTION TO AUTHENTICATE USERS
    const authenticateUsers = async (email, password, done) => {
        //GET USERS BY EMAIL
        const user = getUserByEmail(email);

            if ( user == null ) {
                return done(null, false, {message: "NO USER FOUND WITH THAT EMAIL"});
            }

                try {
                    if ( await bcrypt.compare(password, user.password) ) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: "PASSWORD INCORRECT"});
                    }
                } catch (e) {
                    console.log(e);
                    return done(e);
                }
    }

    passport.use(new Localauthenticate({usernameField: 'email'},authenticateUsers))
    passport.serializeUser((user,done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    });
}

//EXPORTING THE MODOULE
module.exports = initialize;