import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydatabase');
    console.log('Kết nối MongoDB thành công!');
  } catch (err) {
    console.error('Lỗi khi kết nối MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;
