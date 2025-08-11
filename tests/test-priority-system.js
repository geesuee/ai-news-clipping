const assert = require('assert');

// 뉴스 우선순위 시스템 테스트
class NewsPrioritySystemTest {
  constructor() {
    this.testResults = [];
    this.passedTests = 0;
    this.totalTests = 0;
  }

  // 테스트 실행 함수
  runTest(testName, testFunction) {
    this.totalTests++;
    try {
      testFunction();
      this.testResults.push(`✅ ${testName}: 통과`);
      this.passedTests++;
      console.log(`✅ ${testName}: 통과`);
    } catch (error) {
      this.testResults.push(`❌ ${testName}: 실패 - ${error.message}`);
      console.log(`❌ ${testName}: 실패 - ${error.message}`);
    }
  }

  // 우선순위 점수 계산 테스트
  testPriorityScoreCalculation() {
    const prioritySystem = require('./api/news-priority-system');
    
    // 신기술 등장 뉴스 테스트
    const breakthroughNews = {
      title: "Revolutionary New AI Model Breaks All Previous Records",
      content: "A breakthrough in artificial intelligence has been achieved...",
      source: "TechCrunch AI",
      publishedAt: new Date(),
      keywords: ["breakthrough", "revolutionary", "new model", "AI"]
    };
    
    const breakthroughScore = prioritySystem.calculatePriorityScore(breakthroughNews);
    assert(breakthroughScore >= 8.0, `신기술 등장 뉴스 점수가 너무 낮음: ${breakthroughScore}`);
    
    // 새로운 기능 출시 뉴스 테스트
    const featureNews = {
      title: "OpenAI Releases New ChatGPT Features",
      content: "OpenAI has announced new features for ChatGPT...",
      source: "OpenAI Blog",
      publishedAt: new Date(),
      keywords: ["new features", "release", "ChatGPT", "OpenAI"]
    };
    
    const featureScore = prioritySystem.calculatePriorityScore(featureNews);
    assert(featureScore >= 6.0 && featureScore < 8.5, `새로운 기능 출시 뉴스 점수가 예상 범위를 벗어남: ${featureScore}`);
    
    // 새로운 버전 배포 뉴스 테스트
    const versionNews = {
      title: "GPT-5 Beta Version Now Available",
      content: "The beta version of GPT-5 is now available...",
      source: "OpenAI Blog",
      publishedAt: new Date(),
      keywords: ["beta", "new version", "GPT-5", "available"]
    };
    
    const versionScore = prioritySystem.calculatePriorityScore(versionNews);
    assert(versionScore >= 5.0 && versionScore < 8.5, `새로운 버전 배포 뉴스 점수가 예상 범위를 벗어남: ${versionScore}`);
    
    // 일반 뉴스 테스트
    const regularNews = {
      title: "AI Companies Report Q4 Earnings",
      content: "Several AI companies have reported their Q4 earnings...",
      source: "TechCrunch AI",
      publishedAt: new Date(),
      keywords: ["earnings", "Q4", "companies", "AI"]
    };
    
    const regularScore = prioritySystem.calculatePriorityScore(regularNews);
    assert(regularScore >= 3.0 && regularScore <= 6.0, `일반 뉴스 점수가 예상 범위를 벗어남: ${regularScore}`);
  }

  // 우선순위 카테고리 분류 테스트
  testPriorityCategoryClassification() {
    const prioritySystem = require('./api/news-priority-system');
    
    const highPriorityNews = {
      title: "Revolutionary New AI Model Breaks All Previous Records",
      content: "A breakthrough in artificial intelligence has been achieved...",
      source: "TechCrunch AI",
      publishedAt: new Date(),
      keywords: ["breakthrough", "revolutionary", "new model", "AI"]
    };
    
    const category = prioritySystem.classifyPriorityCategory(highPriorityNews);
    assert(category === 'HIGH', `높은 우선순위 뉴스가 잘못 분류됨: ${category}`);
    
    const mediumPriorityNews = {
      title: "OpenAI Releases New ChatGPT Features",
      content: "OpenAI has announced new features for ChatGPT...",
      source: "OpenAI Blog",
      publishedAt: new Date(),
      keywords: ["new features", "release", "ChatGPT", "OpenAI"]
    };
    
    const mediumCategory = prioritySystem.classifyPriorityCategory(mediumPriorityNews);
    assert(mediumCategory === 'MEDIUM', `중간 우선순위 뉴스가 잘못 분류됨: ${mediumCategory}`);
  }

  // 뉴스 정렬 테스트
  testNewsSorting() {
    const prioritySystem = require('./api/news-priority-system');
    
    const newsItems = [
      {
        title: "AI Companies Report Q4 Earnings",
        content: "Several AI companies have reported their Q4 earnings...",
        source: "TechCrunch AI",
        publishedAt: new Date(),
        keywords: ["earnings", "Q4", "companies", "AI"]
      },
      {
        title: "Revolutionary New AI Model Breaks All Previous Records",
        content: "A breakthrough in artificial intelligence has been achieved...",
        source: "TechCrunch AI",
        publishedAt: new Date(),
        keywords: ["breakthrough", "revolutionary", "new model", "AI"]
      },
      {
        title: "OpenAI Releases New ChatGPT Features",
        content: "OpenAI has announced new features for ChatGPT...",
        source: "OpenAI Blog",
        publishedAt: new Date(),
        keywords: ["new features", "release", "ChatGPT", "OpenAI"]
      }
    ];
    
    const sortedNews = prioritySystem.sortNewsByPriority(newsItems);
    
    // 가장 높은 우선순위가 첫 번째에 와야 함
    assert(sortedNews[0].title.includes("Revolutionary"), "가장 높은 우선순위 뉴스가 첫 번째에 위치하지 않음");
    
    // 우선순위 점수가 내림차순으로 정렬되어야 함
    for (let i = 0; i < sortedNews.length - 1; i++) {
      assert(sortedNews[i].priorityScore >= sortedNews[i + 1].priorityScore, 
        "우선순위 점수가 내림차순으로 정렬되지 않음");
    }
  }

  // 키워드 가중치 테스트
  testKeywordWeightCalculation() {
    const prioritySystem = require('./api/news-priority-system');
    
    const newsWithBreakthrough = {
      title: "Breakthrough in AI Technology",
      content: "A major breakthrough has been achieved...",
      source: "TechCrunch AI",
      publishedAt: new Date(),
      keywords: ["breakthrough", "AI", "technology"]
    };
    
    const breakthroughWeight = prioritySystem.calculateKeywordWeight(newsWithBreakthrough);
    assert(breakthroughWeight > 0, "혁신 키워드 가중치가 계산되지 않음");
    
    const newsWithNewVersion = {
      title: "New Version of AI Model Released",
      content: "A new version has been released...",
      source: "OpenAI Blog",
      publishedAt: new Date(),
      keywords: ["new version", "released", "AI model"]
    };
    
    const versionWeight = prioritySystem.calculateKeywordWeight(newsWithNewVersion);
    assert(versionWeight > 0, "새로운 버전 키워드 가중치가 계산되지 않음");
  }

  // 시간 기반 가중치 테스트
  testTimeBasedWeight() {
    const prioritySystem = require('./api/news-priority-system');
    
    const recentNews = {
      title: "Recent AI News",
      content: "This is recent news...",
      source: "TechCrunch AI",
      publishedAt: new Date(),
      keywords: ["AI", "news"]
    };
    
    const recentWeight = prioritySystem.calculateTimeWeight(recentNews);
    assert(recentWeight > 0.8, "최신 뉴스의 시간 가중치가 너무 낮음");
    
    const oldNews = {
      title: "Old AI News",
      content: "This is old news...",
      source: "TechCrunch AI",
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7일 전
      keywords: ["AI", "news"]
    };
    
    const oldWeight = prioritySystem.calculateTimeWeight(oldNews);
    assert(oldWeight < 0.5, "오래된 뉴스의 시간 가중치가 너무 높음");
  }

  // 모든 테스트 실행
  runAllTests() {
    console.log('🚀 뉴스 우선순위 시스템 테스트 시작...\n');
    
    this.runTest('우선순위 점수 계산', () => this.testPriorityScoreCalculation());
    this.runTest('우선순위 카테고리 분류', () => this.testPriorityCategoryClassification());
    this.runTest('뉴스 정렬', () => this.testNewsSorting());
    this.runTest('키워드 가중치 계산', () => this.testKeywordWeightCalculation());
    this.runTest('시간 기반 가중치', () => this.testTimeBasedWeight());
    
    console.log('\n📊 테스트 결과 요약:');
    console.log(`총 테스트: ${this.totalTests}`);
    console.log(`통과: ${this.passedTests}`);
    console.log(`실패: ${this.totalTests - this.passedTests}`);
    
    if (this.passedTests === this.totalTests) {
      console.log('\n🎉 모든 테스트가 통과했습니다!');
    } else {
      console.log('\n❌ 일부 테스트가 실패했습니다.');
    }
    
    return this.passedTests === this.totalTests;
  }
}

// 테스트 실행
if (require.main === module) {
  const testSuite = new NewsPrioritySystemTest();
  testSuite.runAllTests();
}

module.exports = NewsPrioritySystemTest; 