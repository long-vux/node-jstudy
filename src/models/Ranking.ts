import mongoose, { Document, Schema } from 'mongoose';

interface IRanking extends Document {
  user: mongoose.Schema.Types.ObjectId;  // Tham chiếu đến người dùng (User)
  totalScore: number;  // Tổng điểm của người dùng
  solvedExercises: number;  // Số bài học đã hoàn thành
  lastUpdated: Date;  // Ngày cập nhật xếp hạng
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';  // Xếp hạng theo khoảng thời gian
}

const rankingSchema = new Schema<IRanking>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalScore: { type: Number, default: 0 },
  solvedExercises: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  period: { type: String, enum: ['daily', 'weekly', 'monthly', 'all-time'], default: 'all-time' }
}, { timestamps: true });  // Tự động tạo createdAt và updatedAt

export default mongoose.model<IRanking>('Ranking', rankingSchema);
