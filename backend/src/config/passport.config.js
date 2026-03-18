import { Strategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { Env } from "./env.config.js";
import { findByIdUserService } from "../services/user.service.js";

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: Env.JWT_SECRET,
};

passport.use(new Strategy(options, async (payload, done) => {
    try {
        console.log("Passport JWT Payload:", payload);
        if (!payload.userId) {
            console.log("Passport: Missing userId in payload");
            return done(null, false, { message: "Invalid token payload" });
        }
        const user = await findByIdUserService(payload.userId);
        if (!user) {
            console.log("Passport: User not found for userId:", payload.userId);
            return done(null, false);
        }
        console.log("Passport: Authentication successful for user:", user._id);
        return done(null, user);
    }
    catch (error) {
        console.error("Passport Strategy Error:", error);
        return done(error, false);
    }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export const passportAuthenticateJwt = passport.authenticate("jwt", {
    session: false,
});
