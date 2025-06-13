const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우트
app.use('/api', routes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: 'Auto ESG Docs API is running',
    status: 'OK',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 ESG 보고서 생성 서버가 포트 ${PORT}에서 실행 중입니다`);
  console.log(`📍 API 엔드포인트: http://localhost:${PORT}/api`);
  console.log(`🌐 서버 상태 확인: http://localhost:${PORT}/`);
  console.log(`⏰ 시작 시간: ${new Date().toISOString()}`);
}); 