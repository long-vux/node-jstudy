import User from '../models/User';

export const createUser = async (userData: any) => {
    const newUser = new User(userData);
    return await newUser.save();
};
export const findUserByEmail = async (email: string) => {
    return await User.findOne({ email });
};
export const findUserById = async (id: string) => {
    return await User.findById(id);
};