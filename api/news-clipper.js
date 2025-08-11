const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai');

// OpenAI 클라이언트 초기화 (환경 변수가 있을 때만)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// 뉴스 소스 목록 (간단하게 몇 개만)
const NEWS_SOURCES = [
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/tag/artificial-intelligence/',
    selector: 'h2 a, h3 a, .post-block__title a'
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/',
    selector: '.Article__title a, h2 a, h3 a'
  },
  {
    name: 'MIT Tech Review',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/',
    selector: '.teaserItem__title a, h2 a, h3 a'
  },
  {
    name: 'ZDNet AI',
    url: 'https://www.zdnet.com/topic/artificial-intelligence/',
    selector: 'h3 a, h2 a, .item-title a'
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/ai-artificial-intelligence',
    selector: 'h2 a, h3 a'
  },
  {
    name: 'Ars Technica AI',
    url: 'https://arstechnica.com/tag/artificial-intelligence/',
    selector: 'h2 a, h3 a, .entry-title a'
  },
  {
    name: 'Wired AI',
    url: 'https://www.wired.com/tag/artificial-intelligence/',
    selector: 'h3 a, h2 a, .SummaryItemHedLink'
  }
];

// AI 관련 키워드
const AI_KEYWORDS = [
  'AI', 'artificial intelligence', 'machine learning', 'deep learning',
  'GPT', 'ChatGPT', 'OpenAI', 'Google AI', 'Microsoft AI',
  '자율주행', '로봇', '챗봇', '추천시스템', '예측분석', '인공지능',
  '바이브 코딩', 'Cursor', 'Gemini', 'HyperClovaX'
];

// 새로운 우선순위 시스템 import
const prioritySystem = require('./news-priority-system');

// 뉴스 랭킹 점수 계산 함수 (새로운 우선순위 시스템 사용)
function calculateNewsScore(newsItem) {
  // publishedAt 필드가 없으면 현재 시간으로 설정
  if (!newsItem.publishedAt) {
    newsItem.publishedAt = new Date();
  }
  
  // 새로운 우선순위 시스템으로 점수 계산
  return prioritySystem.calculatePriorityScore(newsItem);
}

// 뉴스 랭킹 및 정렬 (새로운 우선순위 시스템 사용)
function rankNews(newsItems) {
  return prioritySystem.sortNewsByPriority(newsItems);
}

// 뉴스 스크래핑 함수
async function scrapeNews(source) {
  try {
    console.log(`스크래핑 중: ${source.name}`);
    const response = await axios.get(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    const newsItems = [];
    
    console.log(`선택자 "${source.selector}"로 요소 검색 중...`);
    const elements = $(source.selector);
    console.log(`${elements.length}개의 요소 발견`);
    
    elements.each((i, element) => {
      if (i < 10) { // 최대 10개까지
        const title = $(element).text().trim();
        let url = $(element).attr('href');
        
        if (title && url) {
          // URL 정규화
          if (!url.startsWith('http')) {
            const baseUrl = source.url.split('/').slice(0, 3).join('/');
            url = url.startsWith('/') ? baseUrl + url : baseUrl + '/' + url;
          }
          
          // AI 관련 키워드가 포함된 뉴스만 필터링
          const hasAIKeyword = AI_KEYWORDS.some(keyword => 
            title.toLowerCase().includes(keyword.toLowerCase())
          );
          
          if (hasAIKeyword) {
            newsItems.push({
              title,
              url,
              source: source.name,
              publishedAt: new Date(), // 현재 시간으로 설정
              content: '' // 빈 내용으로 초기화
            });
            console.log(`✅ AI 뉴스 발견: ${title}`);
          } else {
            console.log(`❌ AI 키워드 없음: ${title}`);
          }
        }
      }
    });
    
    console.log(`${source.name}에서 ${newsItems.length}개의 AI 뉴스 수집 완료`);
    return newsItems;
  } catch (error) {
    console.error(`스크래핑 에러 (${source.name}):`, error.message);
    return [];
  }
}

// 메인 뉴스 요약 생성
async function summarizeMainNews(mainNews) {
  try {
    // OpenAI 클라이언트가 없으면 기본 템플릿 반환
    if (!openai) {
      return `OpenAI는 새로운 AI 기술을 도입했습니다. 이를 통해 AI가 더욱 발전된 기능을 제공할 수 있게 되었습니다.`;
    }
    
    const prompt = `다음 AI 관련 뉴스를 한국어로 핵심만 간결하게 요약해주세요.

요구사항:
- 기사 내용의 핵심을 파악하여 요약
- 정확히 3-4문장으로 요약
- 각 문장은 완성된 형태로 작성
- 마크다운 문법 사용 금지
- 기술적 세부사항보다는 핵심 내용과 영향에 집중
- 읽기 쉽고 이해하기 쉬운 문장으로 작성

제목: ${mainNews.title}
출처: ${mainNews.source}

요약:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 400,
      temperature: 0.2,
      stop: ["\n\n", "다음:", "추가:", "참고:"]
    });
    
    // 마크다운 문법 제거
    let summary = completion.choices[0].message.content;
    summary = summary.replace(/\*\*/g, ''); // ** 제거
    summary = summary.replace(/#{1,6}\s/g, ''); // # 제거
    summary = summary.replace(/`/g, ''); // ` 제거
    
    return summary;
  } catch (error) {
    console.error('OpenAI API 에러:', error.message);
    return `AI 관련 중요한 뉴스입니다.`;
  }
}

// 전체 뉴스 트렌드 요약
async function summarizeTrends(newsItems) {
  try {
    // OpenAI 클라이언트가 없으면 기본 템플릿 반환
    if (!openai) {
      return 'AI 기술이 다양한 분야에서 빠르게 발전하고 있습니다.';
    }
    
    const newsText = newsItems.slice(0, 10).map(item => 
      `제목: ${item.title}\n출처: ${item.source}`
    ).join('\n\n');
    
    const prompt = `다음 AI 관련 뉴스들을 분석하여 오늘의 AI 트렌드를 핵심만 간결하게 요약해주세요.

요구사항:
- 뉴스들의 공통점과 주요 트렌드를 파악하여 요약
- 정확히 2-3문장으로 요약
- 각 문장은 완성된 형태로 작성
- 마크다운 문법 사용 금지
- 기술적 트렌드와 업계 동향에 집중
- 읽기 쉽고 이해하기 쉬운 문장으로 작성

뉴스 목록:
${newsText}

요약:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.2,
      stop: ["\n\n", "다음:", "추가:", "참고:"]
    });
    
    // 마크다운 문법 제거
    let summary = completion.choices[0].message.content;
    summary = summary.replace(/\*\*/g, ''); // ** 제거
    summary = summary.replace(/#{1,6}\s/g, ''); // # 제거
    summary = summary.replace(/`/g, ''); // ` 제거
    
    return summary;
  } catch (error) {
    console.error('OpenAI API 에러:', error.message);
    return 'AI 기술이 다양한 분야에서 빠르게 발전하고 있습니다.';
  }
}

// Slack으로 메시지 전송
async function sendToSlack(mainNews, summary, trendSummary) {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('Slack Webhook URL이 설정되지 않았습니다.');
      return false;
    }
    
    console.log('Slack 메시지 전송 시도...');
    
    const message = {
      text: "🤖 AI 뉴스 클리핑 - 오늘의 AI 동향",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🤖 AI 뉴스 클리핑 - 오늘의 AI 동향"
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `📰 *${mainNews.title}*\n\n⭐ *우선순위*: ${mainNews.priorityCategory} (${mainNews.priorityScore.toFixed(1)}/10.0)\n\n📝 *요약*\n${summary}\n\n🔍 *오늘의 AI 트렌드*\n${trendSummary}`
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `📚 *원문 링크*\n<${mainNews.url}|${mainNews.title}> (${mainNews.source})`
          }
        }
      ]
    };
    
    const response = await axios.post(webhookUrl, message, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('Slack으로 메시지 전송 완료');
    return true;
  } catch (error) {
    console.error('Slack 전송 에러:', error.message);
    return false;
  }
}

// 메인 함수
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
    console.log('AI 뉴스 클리핑 시작...');
    
    // 1. 모든 뉴스 소스에서 뉴스 수집
    const allNews = [];
    for (const source of NEWS_SOURCES) {
      const news = await scrapeNews(source);
      allNews.push(...news);
    }
    
    if (allNews.length === 0) {
      return res.status(200).json({
        success: false,
        message: '수집된 AI 뉴스가 없습니다.',
        newsCount: 0
      });
    }
    
    console.log(`총 ${allNews.length}개의 AI 뉴스 수집 완료`);
    
    // 2. 뉴스 랭킹 및 정렬
    const rankedNews = rankNews(allNews);
    console.log('뉴스 랭킹 완료:', rankedNews.map(n => ({ title: n.title, score: n.score })));
    
    // 3. 메인 뉴스 (1위) 선정
    const mainNews = rankedNews[0];
    console.log('메인 뉴스 선정:', mainNews.title);
    
    // 4. 메인 뉴스 요약
    const summary = await summarizeMainNews(mainNews);
    
    // 5. 전체 트렌드 요약
    const trendSummary = await summarizeTrends(rankedNews);
    
    // 6. Slack으로 전송
    const slackSuccess = await sendToSlack(mainNews, summary, trendSummary);
    
    // 7. 결과 반환
    res.status(200).json({
      success: true,
      message: 'AI 뉴스 클리핑 완료',
      newsCount: allNews.length,
      mainNews: {
        title: mainNews.title,
        url: mainNews.url,
        source: mainNews.source,
        priorityScore: mainNews.priorityScore,
        priorityCategory: mainNews.priorityCategory
      },
      summary: summary,
      trendSummary: trendSummary,
      otherNews: rankedNews.slice(1, 5).map(n => ({
        title: n.title,
        url: n.url,
        source: n.source,
        priorityScore: n.priorityScore,
        priorityCategory: n.priorityCategory
      })),
      slackSent: slackSuccess
    });
    
  } catch (error) {
    console.error('뉴스 클리핑 에러:', error);
    res.status(500).json({
      success: false,
      message: '뉴스 클리핑 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 테스트를 위한 함수 export
module.exports.calculateNewsScore = calculateNewsScore;
module.exports.rankNews = rankNews;
module.exports.scrapeNews = scrapeNews;
module.exports.summarizeMainNews = summarizeMainNews;
module.exports.summarizeTrends = summarizeTrends;
module.exports.sendToSlack = sendToSlack;