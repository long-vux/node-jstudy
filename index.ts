import express, { Request, Response } from 'express';
import cors from 'cors';
// import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';
import { connectDB } from './src/config/db';  
import routes from './src/routes'; 
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './src/config/passport';

dotenv.config();  

const app = express();

// Cấu hình session
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  resave: false,
  saveUninitialized: true
}));

// Khởi tạo passport
app.use(passport.initialize());
app.use(passport.session());


connectDB(); // Kết nối đến MongoDB

// Cấu hình middleware
app.use(cors());
// app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));

// Đăng ký các routes
app.use('/api', routes);

// Middleware xử lý lỗi
// app.use(errorHandler);

// Lắng nghe server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
