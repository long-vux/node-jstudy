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

    deleteUser: async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await UserRepository.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        await UserRepository.deleteUser(id);
        return res.status(200).json({ message: 'User deleted successfully.' });
    }

};

export default UserController;