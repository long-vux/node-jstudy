import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'guest' | 'user' | 'admin';
  profile: {
    fullName: string;
    avatar: string;
    bio: string;
  };
  stats: {
    totalPoints: number;
    solvedExercises: number;
  };
  banned: { type: Boolean, default: false },
  joinedAt: Date; 
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['guest', 'user', 'admin'], default: 'user' },
  profile: {
    fullName: String,
    avatar: String,
    bio: String
  },
  stats: {
    totalPoints: { type: Number, default: 0 },
    solvedExercises: { type: Number, default: 0 }
  },
  joinedAt: { type: Date, default: Date.now }  
}, { timestamps: true });

// Hàm tính toán thời gian tham gia và hiển thị theo định dạng "Tháng 7, 2021"
userSchema.methods.getJoinDate = function () {
  const joinDate = this.joinedAt;
  const month = joinDate.toLocaleString('default', { month: 'long' });  
  const year = joinDate.getFullYear();  
  
  return `Bạn đã tham gia từ tháng ${month} năm ${year}`;
};

export default mongoose.model<IUser>('User', userSchema);