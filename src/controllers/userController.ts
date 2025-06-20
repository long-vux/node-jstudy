import { Request, Response } from 'express';
import UserRepository from '../database/repository/userRepository';

const UserController = {
    getUserById: async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await UserRepository.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json({ user });
    },

    getUsers: async (req: Request, res: Response) => {
        const users = await UserRepository.findAllUsers();
        return res.status(200).json(users);
    },

    updateUser: async (req: Request, res: Response) => {
        const { id } = req.params;
        const updateData = req.body;

        const user = await UserRepository.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // remove password from updateData if it exists
        delete updateData.password;

        const result = await UserRepository.updateUser(id, updateData);
        return res.status(200).json({ message: "Update user successfully", result });
    },

    userDeleteThemselves: async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        await UserRepository.userDeleteThemselves(userId);
        return res.status(200).json({ message: 'Account will be deleted after 30 days.' });
    },

    banUser: async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await UserRepository.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        await UserRepository.updateUser(id, { status: 'banned' });
        return res.status(200).json({ message: 'User banned successfully.' });
    },

    unbanUser: async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await UserRepository.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // check if user is already active
        if (user.status === 'active') {
            return res.status(400).json({ message: 'User is already active, no need to unban.' });
        }
        await UserRepository.updateUser(id, { status: 'active' });
        return res.status(200).json({ message: 'User unbanned successfully.' });
    }
};

export default UserController;