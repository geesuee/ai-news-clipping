require('dotenv').config({ path: '.env.local' });

const express = require('express');
const path = require('path');
const newsClipper = require('./api/news-clipper');

const app = express();
const PORT = 3000;

// 환경변수 확인
console.log('🔑 환경변수 확인:');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '설정됨' : '설정되지 않음');
console.log('SLACK_WEBHOOK_URL:', process.env.SLACK_WEBHOOK_URL ? '설정됨' : '설정되지 않음');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 루트 경로 핸들러
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 뉴스 클리핑 API 엔드포인트
app.post('/api/news-clipper', async (req, res) => {
  try {
    await newsClipper(req, res);
  } catch (error) {
    console.error('서버 에러:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// GET 요청도 처리
app.get('/api/news-clipper', async (req, res) => {
  try {
    await newsClipper(req, res);
  } catch (error) {
    console.error('서버 에러:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`📡 뉴스 클리핑 API: http://localhost:${PORT}/api/news-clipper`);
}); 