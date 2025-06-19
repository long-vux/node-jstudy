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

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Create JWT
    const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    return res.status(200).json({ message: "User login successfully", token, user });
};
