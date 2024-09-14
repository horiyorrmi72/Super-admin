import { Strategy, ExtractJwt } from 'passport-jwt';
import Admin from '../models/admin.model';
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

passport.use(new Strategy(opts, (err, done) => {
    Admin.findOne({ id: jwt_payload._id,function (err, admin) {
        if(err) {
            return done(err, false);
        }
        if(admin) {
            return done(null, admin);
        }else{
            return done(null, false);
        }
    }})
}))

export default passport;