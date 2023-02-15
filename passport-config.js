const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const {getData: users} = require("./model/user.model");

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = users.find(user => user.EMAIL_ID === email)
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
        }

        try {
            if (await bcrypt.compare(password, user.PASSWORD)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.STUDENT_ID))
    passport.deserializeUser((id, done) => {
        return done(null, users.find(user => user.STUDENT_ID === id))
    })
}

module.exports = initialize