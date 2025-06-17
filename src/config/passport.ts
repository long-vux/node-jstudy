import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import  dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.API_URL;

// Cấu hình Passport.js
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

// Cấu hình Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: `${API_URL}/auth/google/callback`
}, (token: string, tokenSecret: string, profile: any, done: any) => {
  return done(null, profile);
}));

// Cấu hình Facebook OAuth
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID!,
  clientSecret: process.env.FACEBOOK_APP_SECRET!,
  callbackURL: `${API_URL}/auth/facebook/callback`
}, (accessToken: string, refreshToken: string, profile: any, done: any) => {
  return done(null, profile);
}));

// Cấu hình GitHub OAuth
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackURL: `${API_URL}/auth/github/callback`
}, (accessToken: string, refreshToken: string, profile: any, done: any) => {
  return done(null, profile);
}));

export default passport;
