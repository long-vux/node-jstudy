import mongoose, { Document, Schema } from 'mongoose';

interface IExercise extends Document {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starterCode: string;
  testCases: Array<{ input: any, expectedOutput: any }>;
}

const exerciseSchema = new Schema<IExercise>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  starterCode: { type: String, default: '// Write your solution here' },
  testCases: [{ input: Schema.Types.Mixed, expectedOutput: Schema.Types.Mixed }]
});

export default mongoose.model<IExercise>('Exercise', exerciseSchema);
