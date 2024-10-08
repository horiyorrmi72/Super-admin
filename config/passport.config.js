import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import Admin from '../models/admin.model.js';
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

passport.use(
	new Strategy(opts, (jwt_payload, done) => {
		Admin.findOne({ _id: jwt_payload._id }, (err, admin) => {
			if (err) {
				return done(err, false);
			}
			if (admin) {
				return done(null, admin);
			} else {
				return done(null, false);
			}
		});
	})
);

export default passport;
