import mongoose, { Document, Schema } from 'mongoose';

interface ILessonScore extends Document {
  user: mongoose.Schema.Types.ObjectId;  // Tham chiếu đến người dùng (User)
  exercise: mongoose.Schema.Types.ObjectId;  // Tham chiếu đến bài học (Lesson)
  score: number;  // Điểm bài học
  solved: boolean;  // Người dùng đã hoàn thành bài học chưa
  submittedAt: Date;  // Thời gian người dùng hoàn thành bài học
}

const lessonScoreSchema = new Schema<ILessonScore>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  score: { type: Number, default: 0 },
  solved: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });  // Tự động tạo createdAt và updatedAt

export default mongoose.model<ILessonScore>('LessonScore', lessonScoreSchema);
