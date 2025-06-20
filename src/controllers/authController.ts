import { Request, Response } from 'express';
import UserRepository from '../database/repository/userRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../services/emailService'; // Import hàm gửi email

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export const register = async (req: Request, res: Response) => {
    const { username, email, password, fullName } = req.body;

    // Check if user already exists by email and username
    const existingUser = await UserRepository.findUserByEmail(email) || await UserRepository.findUserByUsername(username);
    if (existingUser) {
        return res.status(400).json({ message: 'Email or username already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification code
    const verificationCode = crypto.randomBytes(16).toString('hex'); // 16 byte => code 32 characters

    // Create a new user
    const newUser = await UserRepository.createUser({
        username,
        email,
        password: hashedPassword,
        role: 'user',
        profile: { fullName, avatar: '', bio: '' },
        stats: { totalPoints: 0, solvedExercises: 0 },
        status: 'pending-active', // pending until email is verified
        verificationCode,
        isVerified: false,
        joinedAt: new Date(),
    }) as { _id: any, [key: string]: any };

    // Send OTP via email
    const userId = newUser._id;
    if (!userId) {
        return res.status(400).json({ message: 'User not found.' });
    }
    const url = `${process.env.FRONTEND_URL}/verify-email/${userId}/${verificationCode}`

    const subject = 'Verify Your Email'
    let htmlContent = `
      <h1>Welcome to JStudy!</h1>
      <p>Thank you for signing up with JStudy!</p>
      <p>Please click the link below to verify your email:</p>
      <a href="${url}">Verify Email</a>
      <p>This OTP will expire in 1 hour.</p>
    `
    await sendEmail({ toEmail: email, subject, htmlContent })
    res.status(200).json({ message: 'An email has been sent to your email address. Please verify to complete registration.' })
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserRepository.findUserByEmail(email);

    // check if user is banned or pending-deletion
    if (user?.status === "banned") {
        return res.status(401).json({ message: 'Your account is banned. Please contact admin.' });
    }
    if (user?.status === "pending_deletion") {
        return res.status(401).json({ message: 'Your account is pending deletion. You can recover your account within 30 days to continue using the platform.' });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
        const url = `${process.env.FRONTEND_URL}/verify-email/${user._id}/${user.verificationCode}`

        const subject = 'Verify Your Email'
        let htmlContent = `
            <h1>Welcome to JStudy!</h1>
            <p>Thank you for signing up with JStudy!</p>
            <p>Please click the link below to verify your email:</p>
            <a href="${url}">Verify Email</a>
            <p>This OTP will expire in 1 hour.</p>
        `
        
        //   Send OTP via email
        await sendEmail({ toEmail: email, subject, htmlContent })
        return res.status(403).json({ message: 'A verification email has been sent to your email address. Please verify to complete registration.' });
    }

    // Create JWT
    const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '10h' }
    );

    return res.status(200).json({ message: "User login successfully", token, user });
};

export const changePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized: user not found in request.' });
    }
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Both current and new passwords are required.' });
    }

    const userId = req.user.id;
    const user = await UserRepository.findUserById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (!(await bcrypt.compare(currentPassword, user.password))) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    if (await bcrypt.compare(newPassword, user.password)) {
        return res.status(401).json({ message: 'New password cannot be the same as the current password.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await UserRepository.changePassword(userId, hashedNewPassword);
    return res.status(200).json({ message: 'Password changed successfully.' });
};

export const verifyEmail = async (req: Request, res: Response) => {
    const { email, verificationCode } = req.body;

    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    if (user.verificationCode !== verificationCode) {
        return res.status(400).json({ message: 'Invalid verification code.' });
    }

    user.status = 'active';
    user.isVerified = true;
    user.verificationCode = '';
    await user.save();

    res.json({ message: 'Email successfully verified. Your account is now active.' });
};
