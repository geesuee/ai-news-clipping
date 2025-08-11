const newsClipper = require('./news-clipper');

/**
 * 매일 오전 11시에 실행되는 Cron Job
 * Vercel Cron Jobs를 통해 자동 실행
 */
module.exports = async (req, res) => {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    console.log('🕐 매일 오전 11시 뉴스 클리핑 시작...');
    
    // 현재 한국 시간 확인
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
    console.log(`🇰🇷 현재 한국 시간: ${koreaTime.toLocaleString('ko-KR')}`);
    
    // 뉴스 클리핑 실행
    const result = await newsClipper(req, res);
    
    console.log('✅ 매일 뉴스 클리핑 완료');
    return result;
    
  } catch (error) {
    console.error('❌ 매일 뉴스 클리핑 에러:', error);
    res.status(500).json({
      success: false,
      message: '매일 뉴스 클리핑 중 오류가 발생했습니다.',
      error: error.message
    });
  }
}; 