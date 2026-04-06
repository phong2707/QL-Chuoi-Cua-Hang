import express from 'express';
import path from 'path';
import routes from './routes'; // Đảm bảo file này export default router
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 1. CORS: Cho phép React gọi sang
app.use(cors({
  origin: 'http://localhost:5173', // Cổng mặc định của Vite
  credentials: true // Nếu bạn dùng Session/Cookie thì cần cái này
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 2. Session (Giữ nguyên nếu bạn dùng để quản lý đăng nhập phía Backend)
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 } 
}));

// 3. Static files cho Backend (chứa ảnh, file upload...)
app.use(express.static(path.join(__dirname, '../public')));

// 4. Routes API
app.use('/', routes);

app.listen(port, () => {
  console.log(`✅ Server Backend đang chạy tại: http://localhost:${port}`);
});