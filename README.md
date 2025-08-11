# AI 뉴스 클리핑 서비스

AI 관련 뉴스를 자동으로 수집하고 요약하여 슬랙으로 전송하는 서비스입니다.

## 🚀 주요 기능

### ✨ 핵심 기능
- **자동 뉴스 수집**: 다양한 AI 뉴스 소스에서 실시간 뉴스 수집
- **AI 기반 요약**: OpenAI GPT-4를 활용한 뉴스 내용 요약
- **🆕 스마트 우선순위 시스템**: 신기술 등장, 새로운 기능 출시, 새로운 버전 배포 등에 대한 지능형 우선순위 선정
- **슬랙 연동**: 요약된 뉴스를 슬랙 채널에 자동 전송

### 🎯 우선순위 시스템의 장점
- **혁신 기술 우선**: breakthrough, revolutionary 등 혁신 키워드가 포함된 뉴스를 최우선으로 선정
- **새로운 기능 감지**: new feature, launches, releases 등 새로운 기능 출시 뉴스를 빠르게 포착
- **버전 업데이트 추적**: beta, new version 등 새로운 버전 배포 뉴스를 체계적으로 관리
- **시간 기반 가중치**: 최신 뉴스일수록 높은 우선순위 부여
- **출처 신뢰도**: OpenAI Blog, Google AI Blog 등 공식 출처의 뉴스에 높은 가중치 적용

### 🎯 개선된 가독성
- **메인 뉴스**: 가장 중요한 뉴스 하나를 상세하게 요약하여 메인 메시지로 전송
- **쓰레드 메시지**: 2-5위 뉴스는 제목과 URL만 포함하여 쓰레드로 간단하게 전송
- **트렌드 요약**: 전체 뉴스를 종합한 AI 트렌드 요약 제공

## 🏗️ 시스템 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   뉴스 소스     │    │   뉴스 수집기   │    │   AI 요약 엔진  │
│ (RSS, API 등)   │───▶│   (Crawler)     │───▶│   (GPT-4)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   뉴스 랭킹     │    │   슬랙 연동     │
                       │   (Ranking)     │    │   (Slack Bot)   │
                       └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   메인 뉴스     │    │   슬랙 채널     │
                       │   선정 & 요약   │    │   (사용자)      │
                       └─────────────────┘    └─────────────────┘
```

## 📊 뉴스 우선순위 시스템

### 🎯 우선순위 기준
사용자가 요청한 신기술 등장, 새로운 기능 출시, 새로운 버전 배포 등에 대한 세밀한 우선순위를 제공합니다.

#### 🔥 HIGH 우선순위 (8.5-10.0점)
- **혁신 키워드**: breakthrough, revolutionary, groundbreaking, game-changing
- **세계 최초**: first-ever, world-first, industry-first
- **한국어 키워드**: 혁신, 혁명적, 획기적, 최초, 세계최초

#### ⚡ MEDIUM 우선순위 (6.0-8.4점)
- **새로운 기능/제품**: new feature, new product, launches, releases
- **새로운 버전/모델**: new version, beta, alpha, update
- **한국어 키워드**: 새로운 기능, 출시, 발표, 공개, 베타, 업데이트

#### 📰 LOW 우선순위 (0.0-5.9점)
- **기술 발전**: improved, enhanced, better, faster
- **일반 소식**: earnings, companies, research
- **한국어 키워드**: 개선, 향상, 더 빠름, 더 정확

### 🎯 점수 계산 요소
1. **키워드 가중치** (가장 중요): 혁신성, 새로운 기능, 버전 업데이트 등
2. **시간 가중치**: 최신 뉴스일수록 높은 점수 (1시간 이내: 100%, 1주일 이상: 20%)
3. **출처 가중치**: OpenAI Blog (1.3), Google AI Blog (1.3), TechCrunch (1.1) 등
4. **제목 품질**: 적절한 길이, 숫자 포함, AI 핵심 키워드 포함

### 📈 우선순위별 결과
- **HIGH**: 가장 중요한 뉴스로 선정되어 상세 요약 + 트렌드 분석
- **MEDIUM**: 새로운 기능이나 업데이트 뉴스로 중간 우선순위
- **LOW**: 일반적인 AI 소식으로 낮은 우선순위

## 🔧 설치 및 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
# .env 파일 생성
OPENAI_API_KEY=your_openai_api_key_here
SLACK_WEBHOOK_URL=your_slack_webhook_url_here
```

### 3. 서버 실행
```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

### 4. 🆕 자동 실행 설정 (매일 오전 11시)
```bash
# Vercel에 배포
npm run deploy

# 또는
vercel --prod
```

**자동 실행 시간:**
- 🇰🇷 **한국 시간**: 매일 오전 11시
- 🌍 **UTC 시간**: 매일 오전 2시 (UTC+9)

자세한 설정 방법은 [Cron Job 설정 가이드](docs/cron-setup.md)를 참조하세요.

## 🧪 테스트

### 전체 테스트 실행
```bash
npm test
```

### 개별 테스트 실행
```bash
# 기본 연결 테스트
node test.js

# 우선순위 시스템 테스트
node test-priority-system.js

# 우선순위 시스템 예제
node priority-example.js

# 특정 테스트만 실행
node -e "require('./test.js').testConnection()"
```

### 테스트 항목
- ✅ 기본 연결 테스트
- ✅ 뉴스 클리핑 API 테스트
- ✅ **뉴스 우선순위 시스템 테스트** (신규)
- ✅ 메인 뉴스 요약 품질 테스트
- ✅ 트렌드 요약 테스트

### 🆕 우선순위 시스템 테스트
```bash
# 우선순위 점수 계산 테스트
node test-priority-system.js

# 우선순위 시스템 예제 실행
node priority-example.js
```

## 📱 슬랙 메시지 형식

### 🎯 메인 메시지
```
🤖 AI 뉴스 클리핑 - 오늘의 메인 뉴스

📰 뉴스 제목

📝 핵심 내용
[1-2문장 요약]

🔍 주요 포인트
• [주요 포인트 1]
• [주요 포인트 2]

💡 시사점
[AI 업계 영향 및 시사점]

🔗 원문: [URL]

🔍 오늘의 AI 트렌드: [전체 트렌드 요약]
```

### 📚 쓰레드 메시지 (2-5위 뉴스)
```
📚 추가 AI 뉴스

2. 뉴스 제목 2
🔗 원문 보기 (출처)

3. 뉴스 제목 3
🔗 원문 보기 (출처)

4. 뉴스 제목 4
🔗 원문 보기 (출처)

5. 뉴스 제목 5
🔗 원문 보기 (출처)
```

## 🌐 지원 뉴스 소스

- **TechCrunch AI**: AI 관련 최신 기술 뉴스
- **VentureBeat AI**: AI 스타트업 및 투자 뉴스
- **MIT Technology Review**: AI 연구 및 혁신 뉴스
- **ZDNet AI**: AI 기술 및 제품 뉴스
- **The Verge AI**: AI 문화 및 사회적 영향 뉴스
- **Ars Technica AI**: AI 기술 심층 분석
- **Wired AI**: AI 트렌드 및 미래 전망

## 🔍 AI 키워드 필터링

### 영어 키워드
- AI, artificial intelligence, machine learning, deep learning
- GPT, ChatGPT, OpenAI, Google AI, Microsoft AI

### 한국어 키워드
- 인공지능, 머신러닝, 딥러닝, 자연어처리
- 자율주행, 로봇, 챗봇, 추천시스템
- 바이브 코딩, Cursor, Gemini, HyperClovaX

## 📈 성능 최적화

### 🚀 처리 속도
- **병렬 처리**: 여러 뉴스 소스 동시 수집
- **캐싱**: 중복 요청 방지
- **타임아웃**: 10초 이내 응답 보장

### 💾 메모리 효율성
- **스트리밍 처리**: 대용량 데이터 스트리밍 방식 처리
- **가비지 컬렉션**: 불필요한 객체 자동 정리

## 🛠️ API 엔드포인트

### POST /api/news-clipper
AI 뉴스 수집 및 요약 실행

**응답 예시:**
```json
{
  "success": true,
  "message": "AI 뉴스 클리핑 완료",
  "newsCount": 25,
  "mainNews": {
    "title": "OpenAI Releases GPT-5 with Revolutionary Capabilities",
    "url": "https://example.com/news",
    "source": "TechCrunch AI",
    "score": 2.8
  },
  "mainSummary": "상세한 요약 내용...",
  "trendSummary": "🔍 **오늘의 AI 트렌드**: AI 기술이 다양한 분야에서 빠르게 발전하고 있습니다.",
  "otherNews": [
    {
      "title": "Google AI Breakthrough in Quantum Computing",
      "url": "https://example.com/news2",
      "source": "MIT Tech Review",
      "score": 2.5
    }
  ],
  "slackSent": true,
  "threadSent": true
}
```

## 🔒 보안 및 개인정보

- **API 키 보안**: 환경 변수를 통한 안전한 API 키 관리
- **데이터 암호화**: HTTPS를 통한 안전한 데이터 전송
- **접근 제어**: CORS 설정을 통한 안전한 API 접근

## 🚨 문제 해결

### 일반적인 문제
1. **OpenAI API 오류**: API 키 확인 및 할당량 체크
2. **Slack 전송 실패**: Webhook URL 유효성 확인
3. **뉴스 수집 실패**: 네트워크 연결 및 뉴스 소스 상태 확인

### 로그 확인
```bash
# 서버 로그 확인
npm run dev

# 테스트 로그 확인
npm test
```

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**AI 뉴스 클리핑 서비스**로 AI 업계의 최신 동향을 놓치지 마세요! 🚀 