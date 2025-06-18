import mongoose, { Document, Schema } from 'mongoose';

interface IComment extends Document {
  user: mongoose.Schema.Types.ObjectId; // Tham chiếu đến người dùng (User)
  exercise: mongoose.Schema.Types.ObjectId; // Tham chiếu đến bài tập (Exercise)
  content: string; // Nội dung bình luận
  parentComment: mongoose.Schema.Types.ObjectId | null; // Bình luận con (nếu có)
  likes: mongoose.Schema.Types.ObjectId[]; // Danh sách người thích bình luận
  createdAt: Date; // Ngày tạo bình luận
  updatedAt: Date; // Ngày cập nhật bình luận
}

const commentSchema = new Schema<IComment>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true }); // createdAt, updatedAt

export default mongoose.model<IComment>('Comment', commentSchema);
