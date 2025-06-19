import { Request, Response } from 'express';
import UserRepository from '../database/repository/userRepository';

const UserController = {
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
        return res.status(200).json(result);
    }
};

export default UserController;