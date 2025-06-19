import User from '../models/User';

const UserRepository = {
    findUserByEmail: async (email: string) => {
        return await User.findOne({ email });
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

    // change status 
    userDeleteThemselves: async (id: string) => {
        return await User.findByIdAndDelete(id);
    }

    deleteUser: async (id: string) => {
        return await User.findByIdAndDelete(id);
    }

}

export default UserRepository;