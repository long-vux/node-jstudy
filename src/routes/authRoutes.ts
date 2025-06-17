import express, { Request, Response } from 'express';
import passport from '../config/passport';

const router = express.Router();

// Route và Callback route cho Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

// Route và Callback route cho Facebook
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

// Route và Callback route cho GitHub
router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}));
router.get('/github/callback', passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

// Logout route
router.get('/logout', (req: Request, res: Response) => {
    req.logout((err) => {
        res.redirect('/');
    });
});

export default router;
