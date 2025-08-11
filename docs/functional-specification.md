# AI 뉴스 클리핑 서비스 기능명세서

## 1. 시스템 아키텍처

### 1.1 전체 시스템 구조
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   뉴스 소스     │    │   뉴스 수집기   │    │   AI 요약 엔진  │
│ (RSS, API 등)   │───▶│   (Crawler)     │───▶│   (GPT-5)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   중복 제거     │    │   슬랙 연동     │
                       │   (Deduplicator)│    │   (Slack Bot)   │
                       └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   데이터베이스  │    │   슬랙 채널     │
                       │   (PostgreSQL)  │    │   (사용자)      │
                       └─────────────────┘    └─────────────────┘
```

### 1.2 기술 스택
- **백엔드**: Node.js, Express.js
- **AI 모델**: OpenAI GPT-4 API
- **외부 연동**: Slack Webhook API
- **뉴스 수집**: Cheerio, Axios
- **인프라**: Vercel
- **테스트**: Node.js assert

## 2. 핵심 기능 상세 명세

### 2.1 뉴스 수집 기능 (News Collector)

#### 2.1.1 기능 개요
다양한 뉴스 소스에서 AI 관련 뉴스를 자동으로 수집하는 기능

#### 2.1.2 지원 뉴스 소스
- **RSS 피드**: TechCrunch, VentureBeat, MIT Technology Review
- **뉴스 API**: NewsAPI, GNews API
- **AI 전문 사이트**: OpenAI Blog, Google AI Blog, Microsoft AI Blog
- **소셜 미디어**: Twitter (AI 관련 계정), LinkedIn AI 그룹

#### 2.1.3 수집 프로세스
1. **수동 실행**: API 호출을 통한 뉴스 수집
2. **크롤링**: 각 소스별 적절한 크롤링 방식 적용
3. **전처리**: HTML 태그 제거, 텍스트 정제
4. **필터링**: AI 관련 키워드 기반 필터링
5. **우선순위 계산**: 스마트 우선순위 시스템을 통한 뉴스 랭킹

#### 2.1.4 키워드 필터링
```
AI 관련 키워드:
- 인공지능, 머신러닝, 딥러닝, 자연어처리, 컴퓨터비전
- AI, ML, DL, NLP, CV, GPT, BERT, Transformer
- 자율주행, 로봇, 챗봇, 추천시스템, 예측분석
- 바이브 코딩, Cursor, OpenAI, ChatGPT, Gemini, HyperClovaX
```

### 2.2 AI 요약 기능 (AI Summarizer)

#### 2.2.1 기능 개요
OpenAI GPT-4 모델을 활용하여 뉴스 내용을 요약하고 핵심 정보를 추출하는 기능

#### 2.2.2 요약 프로세스
1. **입력 전처리**: 뉴스 텍스트 정제 및 토큰화
2. **프롬프트 생성**: 요약을 위한 구조화된 프롬프트 작성
3. **AI 모델 호출**: GPT-5 API 호출 및 응답 처리
4. **결과 후처리**: 요약 결과 정제 및 구조화

#### 2.2.3 요약 프롬프트 예시
```
다음 AI 관련 뉴스를 한국어로 요약해주세요:

제목: {뉴스 제목}
내용: {뉴스 내용}

다음 형식으로 요약해주세요:
1. 핵심 내용 (2-3문장)
2. 주요 기술/기업명
3. 시장 영향도 (높음/보통/낮음)
4. 추천 독자 (연구자/개발자/투자자/일반인)
```

#### 2.2.4 요약 품질 지표
- **일관성**: 요약 내용의 논리적 일관성
- **완전성**: 핵심 정보 누락 여부
- **가독성**: 문장의 명확성과 이해도
- **정확성**: 원문과의 일치도

### 2.3 스마트 우선순위 시스템 (Smart Priority System)

#### 2.3.1 기능 개요
신기술 등장, 새로운 기능 출시, 새로운 버전 배포 등에 대한 지능형 우선순위를 계산하는 기능

#### 2.3.2 우선순위 카테고리
1. **HIGH 우선순위 (8.5-10.0점)**: 혁신적인 신기술 등장 뉴스
2. **MEDIUM 우선순위 (6.0-8.4점)**: 새로운 기능 출시, 버전 배포 뉴스
3. **LOW 우선순위 (0.0-5.9점)**: 일반적인 AI 소식

#### 2.3.3 우선순위 계산 요소
1. **키워드 가중치** (가장 중요): 혁신성, 새로운 기능, 버전 업데이트 등
2. **시간 가중치**: 최신 뉴스일수록 높은 점수 (1시간 이내: 100%, 1주일 이상: 20%)
3. **출처 가중치**: OpenAI Blog (1.3), Google AI Blog (1.3), TechCrunch (1.1) 등
4. **제목 품질**: 적절한 길이, 숫자 포함, AI 핵심 키워드 포함

#### 2.3.4 키워드 가중치 체계
- **혁신 키워드**: breakthrough, revolutionary, groundbreaking (3.0점)
- **새로운 기능**: new feature, launches, releases (1.8점)
- **새로운 버전**: beta, new version, update (1.5점)
- **기술 발전**: improved, enhanced, better (1.5점)

### 2.4 중복 제거 기능 (Deduplicator)

#### 2.4.1 기능 개요
유사한 내용의 뉴스를 식별하고 중복을 제거하는 기능

#### 2.4.2 중복 판단 기준
1. **제목 유사도**: 80% 이상 유사한 제목
2. **내용 유사도**: 70% 이상 유사한 내용
3. **시간 간격**: 24시간 이내 발행된 유사 뉴스
4. **출처 신뢰도**: 더 신뢰할 수 있는 출처 우선

#### 2.3.3 중복 제거 알고리즘
- **텍스트 유사도**: TF-IDF + 코사인 유사도
- **시맨틱 유사도**: OpenAI Embedding API 활용
- **클러스터링**: DBSCAN 알고리즘으로 유사 뉴스 그룹화

### 2.4 슬랙 연동 기능 (Slack Integration)

#### 2.4.1 기능 개요
요약된 뉴스를 슬랙 채널에 자동으로 공유하는 기능

#### 2.4.2 메시지 형식
```
🤖 AI 뉴스 클리핑 - {날짜}

📰 {뉴스 제목}
🔗 {원문 링크}
📝 {요약 내용}
🏷️ 카테고리: {카테고리}
⭐ 중요도: {중요도 점수}
⏰ 발행시간: {발행시간}
```

#### 2.4.3 공유 설정
- **시간대**: 매일 오전 11시 (한국 시간)
- **빈도**: 하루 한 번
- **채널**: 사용자가 지정한 슬랙 채널
- **알림**: 우선순위 높은 뉴스는 상세 요약으로 전송

## 3. 데이터 모델

### 3.1 뉴스 테이블 (news)
```sql
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    url VARCHAR(1000) UNIQUE NOT NULL,
    source VARCHAR(100) NOT NULL,
    published_at TIMESTAMP NOT NULL,
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(50),
    importance_score DECIMAL(3,2),
    is_duplicate BOOLEAN DEFAULT FALSE,
    duplicate_of INTEGER REFERENCES news(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 요약 테이블 (summaries)
```sql
CREATE TABLE summaries (
    id SERIAL PRIMARY KEY,
    news_id INTEGER REFERENCES news(id) NOT NULL,
    summary_text TEXT NOT NULL,
    key_technologies TEXT[],
    market_impact VARCHAR(20),
    target_audience VARCHAR(100),
    quality_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 설정 테이블 (settings)
```sql
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4. API 엔드포인트

### 4.1 뉴스 관련 API
```
GET /api/news - 뉴스 목록 조회
GET /api/news/{id} - 특정 뉴스 상세 조회
POST /api/news/collect - 수동 뉴스 수집 실행
DELETE /api/news/{id} - 뉴스 삭제
```

### 4.2 요약 관련 API
```
GET /api/summaries - 요약 목록 조회
GET /api/summaries/{id} - 특정 요약 조회
POST /api/summaries - 뉴스 요약 생성
PUT /api/summaries/{id} - 요약 수정
```

### 4.3 설정 관련 API
```
GET /api/settings - 설정 조회
PUT /api/settings/{key} - 설정 수정
POST /api/settings - 설정 생성
```

### 4.4 슬랙 관련 API
```
POST /api/slack/send - 슬랙 메시지 전송
GET /api/slack/channels - 연결된 채널 목록
POST /api/slack/connect - 슬랙 워크스페이스 연결
```

## 5. 비즈니스 로직

### 5.1 뉴스 수집 스케줄러
```python
@celery.task
def collect_news_task():
    """매시간 실행되는 뉴스 수집 태스크"""
    for source in news_sources:
        try:
            news_items = collect_from_source(source)
            for item in news_items:
                if is_ai_related(item):
                    save_news(item)
        except Exception as e:
            logger.error(f"Error collecting from {source}: {e}")
```

### 5.2 AI 요약 프로세스
```python
async def summarize_news(news_id: int) -> Summary:
    """뉴스 요약 생성"""
    news = get_news(news_id)
    prompt = create_summary_prompt(news)
    
    try:
        response = await openai_client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        
        summary_text = response.choices[0].message.content
        summary = create_summary(news_id, summary_text)
        
        return summary
    except Exception as e:
        logger.error(f"Error summarizing news {news_id}: {e}")
        raise
```

### 5.3 중복 제거 프로세스
```python
def remove_duplicates():
    """중복 뉴스 제거"""
    recent_news = get_recent_news(hours=24)
    
    for news in recent_news:
        similar_news = find_similar_news(news)
        if similar_news:
            mark_as_duplicate(news, similar_news[0])
```

## 6. 에러 처리

### 6.1 일반적인 에러 상황
- **API 호출 실패**: 재시도 로직 및 폴백 처리
- **데이터베이스 연결 실패**: 연결 풀 관리 및 재연결
- **AI 모델 응답 실패**: 기본 요약 템플릿 사용
- **슬랙 전송 실패**: 재시도 및 알림 로그

### 6.2 에러 로깅
```python
import logging

logger = logging.getLogger(__name__)

def handle_error(error: Exception, context: str):
    """에러 처리 및 로깅"""
    logger.error(f"Error in {context}: {str(error)}")
    
    # 중요 에러는 알림 전송
    if is_critical_error(error):
        send_alert_notification(error, context)
```

이 기능명세서는 AI 뉴스 클리핑 서비스의 모든 기능과 요구사항을 상세하게 정의합니다. 개발팀은 이 문서를 기반으로 TDD 방식으로 개발을 진행하며, 각 단계별로 테스트를 통과한 후 다음 단계로 진행합니다. 