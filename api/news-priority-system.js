/**
 * AI 뉴스 우선순위 시스템
 * 신기술 등장, 새로운 기능 출시, 새로운 버전 배포 등에 대한 우선순위를 계산
 */

// 우선순위 카테고리
const PRIORITY_CATEGORIES = {
  HIGH: 'HIGH',      // 높은 우선순위 (8.0-10.0)
  MEDIUM: 'MEDIUM',  // 중간 우선순위 (6.0-7.9)
  LOW: 'LOW'         // 낮은 우선순위 (0.0-5.9)
};

// 혁신 키워드 가중치 (가장 높은 우선순위)
const BREAKTHROUGH_KEYWORDS = {
  'breakthrough': 3.0,
  'revolutionary': 3.0,
  'groundbreaking': 3.0,
  'game-changing': 3.0,
  'paradigm shift': 3.0,
  'first-ever': 3.0,
  'never-before-seen': 3.0,
  'world-first': 3.0,
  'industry-first': 3.0,
  '혁신': 3.0,
  '혁명적': 3.0,
  '획기적': 3.0,
  '최초': 3.0,
  '세계최초': 3.0
};

// 새로운 기능/제품 출시 키워드 가중치 (높은 우선순위)
const NEW_FEATURE_KEYWORDS = {
  'new feature': 1.8,
  'new product': 1.8,
  'new service': 1.8,
  'announces': 1.8,
  'launches': 1.8,
  'introduces': 1.8,
  'unveils': 1.8,
  'releases': 1.8,
  'debuts': 1.8,
  '새로운 기능': 1.8,
  '새로운 제품': 1.8,
  '출시': 1.8,
  '발표': 1.8,
  '공개': 1.8
};

// 새로운 버전/모델 키워드 가중치 (중간-높은 우선순위)
const NEW_VERSION_KEYWORDS = {
  'new version': 1.5,
  'new model': 1.5,
  'beta': 1.5,
  'alpha': 1.5,
  'preview': 1.5,
  'update': 1.5,
  'upgrade': 1.5,
  'iteration': 1.5,
  'generation': 1.5,
  '새로운 버전': 1.5,
  '새로운 모델': 1.5,
  '베타': 1.5,
  '알파': 1.5,
  '업데이트': 1.5
};

// 기술 발전 키워드 가중치 (중간 우선순위)
const TECHNICAL_ADVANCEMENT_KEYWORDS = {
  'improved': 1.5,
  'enhanced': 1.5,
  'better': 1.5,
  'faster': 1.5,
  'more accurate': 1.5,
  'efficient': 1.5,
  'advanced': 1.5,
  '개선': 1.5,
  '향상': 1.5,
  '더 빠름': 1.5,
  '더 정확': 1.5,
  '효율적': 1.5
};

// 출처별 가중치
const SOURCE_WEIGHTS = {
  'OpenAI Blog': 1.3,
  'Google AI Blog': 1.3,
  'Microsoft AI Blog': 1.2,
  'Anthropic Blog': 1.2,
  'TechCrunch AI': 1.1,
  'MIT Technology Review': 1.1,
  'VentureBeat AI': 1.0,
  'Ars Technica AI': 1.0,
  'The Verge AI': 1.0,
  'ZDNet AI': 1.0,
  'Wired AI': 1.0
};

/**
 * 뉴스 제목과 내용에서 키워드를 추출
 */
function extractKeywords(title, content = '') {
  const text = `${title} ${content}`.toLowerCase();
  const keywords = [];
  
  // 모든 키워드 그룹을 하나의 객체로 병합
  const allKeywords = {
    ...BREAKTHROUGH_KEYWORDS,
    ...NEW_FEATURE_KEYWORDS,
    ...NEW_VERSION_KEYWORDS,
    ...TECHNICAL_ADVANCEMENT_KEYWORDS
  };
  
  // 키워드 매칭
  for (const [keyword, weight] of Object.entries(allKeywords)) {
    if (text.includes(keyword.toLowerCase())) {
      keywords.push({ keyword, weight, category: getKeywordCategory(keyword) });
    }
  }
  
  return keywords;
}

/**
 * 키워드의 카테고리를 반환
 */
function getKeywordCategory(keyword) {
  if (BREAKTHROUGH_KEYWORDS[keyword]) return 'BREAKTHROUGH';
  if (NEW_FEATURE_KEYWORDS[keyword]) return 'NEW_FEATURE';
  if (NEW_VERSION_KEYWORDS[keyword]) return 'NEW_VERSION';
  if (TECHNICAL_ADVANCEMENT_KEYWORDS[keyword]) return 'TECHNICAL_ADVANCEMENT';
  return 'GENERAL';
}

/**
 * 키워드 가중치 계산
 */
function calculateKeywordWeight(newsItem) {
  const keywords = extractKeywords(newsItem.title, newsItem.content);
  let totalWeight = 0;
  
  // 카테고리별로 가장 높은 가중치만 사용 (중복 방지)
  const categoryWeights = {};
  for (const keywordInfo of keywords) {
    const category = keywordInfo.category;
    if (!categoryWeights[category] || keywordInfo.weight > categoryWeights[category]) {
      categoryWeights[category] = keywordInfo.weight;
    }
  }
  
  // 각 카테고리의 최고 가중치 합산
  for (const weight of Object.values(categoryWeights)) {
    totalWeight += weight;
  }
  
  // 다양한 카테고리의 키워드가 있으면 보너스
  if (Object.keys(categoryWeights).length > 1) {
    totalWeight += 0.3;
  }
  
  return totalWeight;
}

/**
 * 시간 기반 가중치 계산 (최신 뉴스일수록 높은 점수)
 */
function calculateTimeWeight(newsItem) {
  const now = new Date();
  const publishedTime = new Date(newsItem.publishedAt);
  const timeDiff = now - publishedTime;
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  if (hoursDiff <= 1) return 1.0;        // 1시간 이내: 100%
  if (hoursDiff <= 6) return 0.9;        // 6시간 이내: 90%
  if (hoursDiff <= 24) return 0.8;       // 24시간 이내: 80%
  if (hoursDiff <= 72) return 0.6;       // 3일 이내: 60%
  if (hoursDiff <= 168) return 0.4;      // 1주일 이내: 40%
  return 0.2;                            // 1주일 이상: 20%
}

/**
 * 출처 가중치 계산
 */
function calculateSourceWeight(newsItem) {
  return SOURCE_WEIGHTS[newsItem.source] || 1.0;
}

/**
 * 제목 품질 가중치 계산
 */
function calculateTitleQualityWeight(newsItem) {
  const title = newsItem.title;
  let weight = 0;
  
  // 제목 길이 (적당한 길이가 좋음)
  if (title.length >= 30 && title.length <= 80) {
    weight += 0.3;
  }
  
  // 특수 문자나 숫자 포함 (구체적인 정보)
  if (/\d/.test(title)) {
    weight += 0.2;
  }
  
  // AI 관련 핵심 키워드 포함
  const aiKeywords = ['AI', 'GPT', 'ChatGPT', 'Gemini', 'Claude', '인공지능', '머신러닝'];
  for (const keyword of aiKeywords) {
    if (title.toLowerCase().includes(keyword.toLowerCase())) {
      weight += 0.2;
      break;
    }
  }
  
  return weight;
}

/**
 * 전체 우선순위 점수 계산
 */
function calculatePriorityScore(newsItem) {
  let totalScore = 0;
  
  // 1. 키워드 가중치 (가장 중요)
  const keywordWeight = calculateKeywordWeight(newsItem);
  totalScore += keywordWeight * 2.0;
  
  // 2. 시간 가중치
  const timeWeight = calculateTimeWeight(newsItem);
  totalScore += timeWeight * 1.5;
  
  // 3. 출처 가중치
  const sourceWeight = calculateSourceWeight(newsItem);
  totalScore += sourceWeight * 1.0;
  
  // 4. 제목 품질 가중치
  const titleQualityWeight = calculateTitleQualityWeight(newsItem);
  totalScore += titleQualityWeight;
  
  // 5. 기본 점수
  totalScore += 1.0;
  
  // 최대 점수 제한 (10점 만점)
  return Math.min(totalScore, 10.0);
}

/**
 * 우선순위 카테고리 분류
 */
function classifyPriorityCategory(newsItem) {
  const score = calculatePriorityScore(newsItem);
  
  if (score >= 8.5) return PRIORITY_CATEGORIES.HIGH;
  if (score >= 6.0) return PRIORITY_CATEGORIES.MEDIUM;
  return PRIORITY_CATEGORIES.LOW;
}

/**
 * 뉴스를 우선순위에 따라 정렬
 */
function sortNewsByPriority(newsItems) {
  return newsItems
    .map(item => ({
      ...item,
      priorityScore: calculatePriorityScore(item),
      priorityCategory: classifyPriorityCategory(item)
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

/**
 * 우선순위별 뉴스 그룹화
 */
function groupNewsByPriority(newsItems) {
  const grouped = {
    [PRIORITY_CATEGORIES.HIGH]: [],
    [PRIORITY_CATEGORIES.MEDIUM]: [],
    [PRIORITY_CATEGORIES.LOW]: []
  };
  
  for (const item of newsItems) {
    const category = classifyPriorityCategory(item);
    grouped[category].push({
      ...item,
      priorityScore: calculatePriorityScore(item),
      priorityCategory: category
    });
  }
  
  // 각 카테고리 내에서 점수순 정렬
  for (const category of Object.keys(grouped)) {
    grouped[category].sort((a, b) => b.priorityScore - a.priorityScore);
  }
  
  return grouped;
}

/**
 * 우선순위 점수에 대한 설명 생성
 */
function generatePriorityExplanation(newsItem) {
  const score = calculatePriorityScore(newsItem);
  const category = classifyPriorityCategory(newsItem);
  const keywords = extractKeywords(newsItem.title, newsItem.content);
  
  let explanation = `우선순위 점수: ${score.toFixed(1)}/10.0 (${category})\n`;
  explanation += `주요 키워드: ${keywords.map(k => k.keyword).join(', ')}\n`;
  
  if (category === PRIORITY_CATEGORIES.HIGH) {
    explanation += `이 뉴스는 혁신적인 기술이나 중요한 발표를 다루고 있어 높은 우선순위를 받았습니다.`;
  } else if (category === PRIORITY_CATEGORIES.MEDIUM) {
    explanation += `이 뉴스는 새로운 기능이나 업데이트를 다루고 있어 중간 우선순위를 받았습니다.`;
  } else {
    explanation += `이 뉴스는 일반적인 AI 관련 소식을 다루고 있습니다.`;
  }
  
  return explanation;
}

module.exports = {
  PRIORITY_CATEGORIES,
  calculatePriorityScore,
  classifyPriorityCategory,
  sortNewsByPriority,
  groupNewsByPriority,
  calculateKeywordWeight,
  calculateTimeWeight,
  calculateSourceWeight,
  calculateTitleQualityWeight,
  extractKeywords,
  generatePriorityExplanation
}; 