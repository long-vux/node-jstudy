import express, { Request, Response } from 'express';
import cors from 'cors';
// import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';
import { connectDB } from './database/dbConnection';  
import routes from './routes'; 
import dotenv from 'dotenv';
import session from 'express-session';
// import passport from './config/passport';



dotenv.config();  

const app = express();

// config session
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  resave: false,
  saveUninitialized: true
}));

// Khởi tạo passport
// app.use(passport.initialize());
// app.use(passport.session());


connectDB(); // connect to MongoDB

app.use(cors());
// app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
