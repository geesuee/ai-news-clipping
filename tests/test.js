const axios = require('axios');

// 테스트 설정
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_TIMEOUT = 60000; // 60초

// 테스트 헬퍼 함수
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message) {
  console.error(`❌ ${message}`);
}

function logInfo(message) {
  console.log(`ℹ️ ${message}`);
}

// 기본 연결 테스트
async function testConnection() {
  try {
    log('기본 연결 테스트 시작...');
    const response = await axios.get(`${BASE_URL}/`, { timeout: 10000 });
    
    if (response.status === 200) {
      logSuccess('서버 연결 성공');
      return true;
    } else {
      logError(`서버 응답 상태: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`연결 실패: ${error.message}`);
    return false;
  }
}

// 뉴스 클리핑 API 테스트
async function testNewsClipping() {
  try {
    log('뉴스 클리핑 API 테스트 시작...');
    
    const response = await axios.post(`${BASE_URL}/api/news-clipper`, {}, {
      timeout: TEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200) {
      const data = response.data;
      
      if (data.success) {
        logSuccess('뉴스 클리핑 성공');
        logInfo(`수집된 뉴스 수: ${data.newsCount}`);
        
        // 메인 뉴스 정보 확인
        if (data.mainNews) {
          logInfo(`메인 뉴스: ${data.mainNews.title}`);
          logInfo(`메인 뉴스 점수: ${data.mainNews.score}`);
          logInfo(`메인 뉴스 출처: ${data.mainNews.source}`);
        }
        
        // 메인 요약 확인
        if (data.mainSummary) {
          logInfo('메인 뉴스 요약 생성 완료');
          logInfo(`요약 길이: ${data.mainSummary.length} 문자`);
        }
        
        // 트렌드 요약 확인
        if (data.trendSummary) {
          logInfo('트렌드 요약 생성 완료');
          logInfo(`트렌드 요약: ${data.trendSummary}`);
        }
        
        // 추가 뉴스 확인
        if (data.otherNews && data.otherNews.length > 0) {
          logInfo(`추가 뉴스 수: ${data.otherNews.length}`);
          data.otherNews.forEach((news, index) => {
            logInfo(`${index + 2}위: ${news.title} (점수: ${news.score})`);
          });
        }
        
        // Slack 전송 상태 확인
        logInfo(`Slack 메인 메시지 전송: ${data.slackSent ? '성공' : '실패'}`);
        logInfo(`Slack 쓰레드 메시지 전송: ${data.threadSent ? '성공' : '실패'}`);
        
        return true;
      } else {
        logError(`뉴스 클리핑 실패: ${data.message}`);
        return false;
      }
    } else {
      logError(`API 응답 상태: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`뉴스 클리핑 테스트 실패: ${error.message}`);
    if (error.response) {
      logError(`응답 상태: ${error.response.status}`);
      logError(`응답 데이터: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// 뉴스 랭킹 시스템 테스트
async function testNewsRanking() {
  try {
    log('뉴스 랭킹 시스템 테스트 시작...');
    
    const response = await axios.post(`${BASE_URL}/api/news-clipper`, {}, {
      timeout: TEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200 && response.data.success) {
      const data = response.data;
      
      // 랭킹 순서 확인
      if (data.mainNews && data.otherNews) {
        const allNews = [data.mainNews, ...data.otherNews];
        
        // 점수가 내림차순으로 정렬되어 있는지 확인
        for (let i = 0; i < allNews.length - 1; i++) {
          if (allNews[i].score < allNews[i + 1].score) {
            logError(`랭킹 순서 오류: ${i + 1}위(${allNews[i].score}) < ${i + 2}위(${allNews[i + 1].score})`);
            return false;
          }
        }
        
        logSuccess('뉴스 랭킹 순서 정상');
        
        // 점수 범위 확인 (0.5 ~ 3.0 정도 예상)
        const validScores = allNews.every(news => news.score >= 0.5 && news.score <= 5.0);
        if (validScores) {
          logSuccess('뉴스 점수 범위 정상');
        } else {
          logError('뉴스 점수 범위 이상');
          return false;
        }
        
        return true;
      } else {
        logError('뉴스 랭킹 데이터 누락');
        return false;
      }
    } else {
      logError('뉴스 랭킹 테스트를 위한 API 호출 실패');
      return false;
    }
  } catch (error) {
    logError(`뉴스 랭킹 테스트 실패: ${error.message}`);
    return false;
  }
}

// 메인 뉴스 요약 품질 테스트
async function testMainNewsSummary() {
  try {
    log('메인 뉴스 요약 품질 테스트 시작...');
    
    const response = await axios.post(`${BASE_URL}/api/news-clipper`, {}, {
      timeout: TEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200 && response.data.success) {
      const data = response.data;
      
      if (data.mainSummary) {
        const summary = data.mainSummary;
        
        // 필수 섹션 확인
        const requiredSections = ['📰', '📝', '🔍', '💡', '🔗'];
        const missingSections = requiredSections.filter(section => !summary.includes(section));
        
        if (missingSections.length === 0) {
          logSuccess('메인 뉴스 요약 섹션 완성');
        } else {
          logError(`누락된 섹션: ${missingSections.join(', ')}`);
          return false;
        }
        
        // 요약 길이 확인 (너무 짧거나 길지 않아야 함)
        if (summary.length >= 200 && summary.length <= 2000) {
          logSuccess('메인 뉴스 요약 길이 적절');
        } else {
          logError(`메인 뉴스 요약 길이 부적절: ${summary.length} 문자`);
          return false;
        }
        
        // 한국어 포함 확인
        const koreanPattern = /[가-힣]/;
        if (koreanPattern.test(summary)) {
          logSuccess('메인 뉴스 요약 한국어 포함');
        } else {
          logError('메인 뉴스 요약에 한국어가 없습니다');
          return false;
        }
        
        return true;
      } else {
        logError('메인 뉴스 요약 데이터 누락');
        return false;
      }
    } else {
      logError('메인 뉴스 요약 테스트를 위한 API 호출 실패');
      return false;
    }
  } catch (error) {
    logError(`메인 뉴스 요약 테스트 실패: ${error.message}`);
    return false;
  }
}

// 트렌드 요약 테스트
async function testTrendSummary() {
  try {
    log('트렌드 요약 테스트 시작...');
    
    const response = await axios.post(`${BASE_URL}/api/news-clipper`, {}, {
      timeout: TEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 200 && response.data.success) {
      const data = response.data;
      
      if (data.trendSummary) {
        const trendSummary = data.trendSummary;
        
        // 트렌드 섹션 포함 확인
        if (trendSummary.includes('🔍') && trendSummary.includes('오늘의 AI 트렌드')) {
          logSuccess('트렌드 요약 형식 정상');
        } else {
          logError('트렌드 요약 형식 이상');
          return false;
        }
        
        // 요약 길이 확인 (간단해야 함)
        if (trendSummary.length >= 50 && trendSummary.length <= 500) {
          logSuccess('트렌드 요약 길이 적절');
        } else {
          logError(`트렌드 요약 길이 부적절: ${trendSummary.length} 문자`);
          return false;
        }
        
        return true;
      } else {
        logError('트렌드 요약 데이터 누락');
        return false;
      }
    } else {
      logError('트렌드 요약 테스트를 위한 API 호출 실패');
      return false;
    }
  } catch (error) {
    logError(`트렌드 요약 테스트 실패: ${error.message}`);
    return false;
  }
}

// 메인 테스트 실행
async function runAllTests() {
  log('🚀 AI 뉴스 클리핑 서비스 테스트 시작');
  log('=' * 50);
  
  const tests = [
    { name: '기본 연결', fn: testConnection },
    { name: '뉴스 클리핑 API', fn: testNewsClipping },
    { name: '뉴스 랭킹 시스템', fn: testNewsRanking },
    { name: '메인 뉴스 요약 품질', fn: testMainNewsSummary },
    { name: '트렌드 요약', fn: testTrendSummary }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    log(`\n📋 ${test.name} 테스트 실행 중...`);
    try {
      const result = await test.fn();
      if (result) {
        logSuccess(`${test.name} 테스트 통과`);
        passedTests++;
      } else {
        logError(`${test.name} 테스트 실패`);
      }
    } catch (error) {
      logError(`${test.name} 테스트 실행 중 오류: ${error.message}`);
    }
  }
  
  log('\n' + '=' * 50);
  log(`📊 테스트 결과: ${passedTests}/${totalTests} 통과`);
  
  if (passedTests === totalTests) {
    logSuccess('🎉 모든 테스트 통과!');
    process.exit(0);
  } else {
    logError('❌ 일부 테스트 실패');
    process.exit(1);
  }
}

// 환경 변수 확인
function checkEnvironment() {
  log('🔍 환경 변수 확인 중...');
  
  const requiredEnvVars = ['OPENAI_API_KEY', 'SLACK_WEBHOOK_URL'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    logError(`누락된 환경 변수: ${missingVars.join(', ')}`);
    logInfo('환경 변수를 설정한 후 다시 시도하세요.');
    process.exit(1);
  }
  
  logSuccess('환경 변수 설정 완료');
}

// 메인 실행
async function main() {
  try {
    checkEnvironment();
    await runAllTests();
  } catch (error) {
    logError(`테스트 실행 중 치명적 오류: ${error.message}`);
    process.exit(1);
  }
}

// 스크립트 직접 실행 시에만 테스트 실행
if (require.main === module) {
  main();
}

module.exports = {
  testConnection,
  testNewsClipping,
  testNewsRanking,
  testMainNewsSummary,
  testTrendSummary,
  runAllTests
}; 