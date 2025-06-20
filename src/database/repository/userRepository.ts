import User from '../models/User';

const UserRepository = {
    findUserByEmail: async (email: string) => {
        return await User.findOne({ email });
    },

    findUserByUsername: async (username: string) => {
        return await User.findOne({ username });
    },

    findUserById: async (id: string) => {
        return await User.findById(id);
    },

    findAllUsers: async () => {
        return await User.find();
    },

    updateUser: async (id: string, updateData: any) => {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    },

    createUser: async (userData: any) => {
        const newUser = new User(userData);
        return await newUser.save();
    },

    // change status of user to deleted -> change status to pending_deletion
    userDeleteThemselves: async (id: string) => {
        return await User.findByIdAndUpdate(
            id,
            {
                status: 'pending_deletion',
                deletionRequestedAt: new Date()
            }
        );
    },

    // delete permanently
    deleteUser: async (id: string) => {
        return await User.findByIdAndDelete(id);
    },

    changePassword: async (id: string, newPassword: string) => {
        return await User.findByIdAndUpdate(id, { password: newPassword });
    }
}

export default UserRepository;