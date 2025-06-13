const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우트
app.use('/api', routes);

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Auto ESG Docs API is running');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 