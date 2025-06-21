import { Request, Response } from 'express';
import UserRepository from '../database/repository/userRepository';
import { uploadToS3, getFromS3, deleteFromS3 } from '../utils/s3Upload';

const UserController = {
    getUserById: async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await UserRepository.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // if user has an avatar, get the url from S3
        let avatarUrl = null;
        if (user.profile.avatar) {
            avatarUrl = await getFromS3(user.profile.avatar);
        }

        // return user object with avatarUrl
        return res.status(200).json({
            user: {
                ...user.toObject(),
                profile: {
                    ...user.profile,
                    avatar: avatarUrl
                }
            }
        });
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

        // check if user update username and username is already taken
        if (updateData.username && updateData.username !== user.username) {
            const existingUser = await UserRepository.findUserByUsername(updateData.username);
            if (existingUser) {
                return res.status(400).json({ message: 'Username is already taken.' });
            }
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
    },

    uploadAvatar: async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // get file buffer and file name
        const fileBuffer = req.file.buffer;
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const mimeType = req.file.mimetype;

        // Upload the new avatar to S3
        const fileUrl = await uploadToS3({
            fileBuffer,
            fileName: `avatar/${fileName}`,
            mimeType,
        });

        // Check if user has an existing avatar, if so, delete it
        const user = await UserRepository.findUserById(req.user?.id!);
        if (user && user.profile.avatar) {
            const existingImageUrl = user.profile.avatar;
            const existingImageName = existingImageUrl.split('/').pop();

            // Delete the old avatar from S3
            await deleteFromS3({ fileName: `avatar/${existingImageName}` });

            // Clear the existing avatar URL in the database
            await UserRepository.updateUser(req.user?.id!, { 'profile.avatar': null });
        }

        // Save the new image URL to the database
        await UserRepository.updateUserProfileImage(req.user?.id!, fileUrl);

        // Return success response
        res.status(200).json({ message: 'Profile image uploaded successfully', imageUrl: fileUrl });
    }
};

export default UserController;