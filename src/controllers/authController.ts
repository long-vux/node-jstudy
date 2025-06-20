import { Request, Response } from 'express';
import UserRepository from '../database/repository/userRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export const register = async (req: Request, res: Response) => {
    const { username, email, password, fullName } = req.body;

    // Check if user already exists
    const existingUser = await UserRepository.findUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await UserRepository.createUser({
        username,
        email,
        password: hashedPassword,
        role: 'user',
        profile: { fullName, avatar: '', bio: '' },
        stats: { totalPoints: 0, solvedExercises: 0 },
        banned: false,
        joinedAt: new Date(),
    });

    return res.status(201).json({ message: 'User registered successfully.', user: newUser });
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

    if(await bcrypt.compare(newPassword, user.password)) {
        return res.status(401).json({ message: 'New password cannot be the same as the current password.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await UserRepository.changePassword(userId, hashedNewPassword);
    return res.status(200).json({ message: 'Password changed successfully.' });
};