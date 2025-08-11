# 매일 오전 11시 자동 슬랙 메시지 전송 설정 가이드

## 🕐 자동 실행 시간

- **한국 시간**: 매일 오전 11시
- **UTC 시간**: 매일 오전 2시 (UTC+9)
- **실행 빈도**: 하루 1회

## 🚀 설정 방법

### 1. Vercel Cron Jobs 설정

`vercel.json` 파일에 이미 Cron Job이 설정되어 있습니다:

```json
{
  "crons": [
    {
      "path": "/api/cron-daily-news",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**Cron 표현식 설명:**
- `0 2 * * *` = 매일 UTC 오전 2시 (한국 시간 오전 11시)
- `0` = 분 (0분)
- `2` = 시간 (2시, UTC)
- `*` = 일 (매일)
- `*` = 월 (매월)
- `*` = 요일 (매주)

### 2. API 엔드포인트

Cron Job이 실행할 API 엔드포인트: `/api/cron-daily-news`

이 API는 다음을 수행합니다:
1. 현재 한국 시간 확인
2. 뉴스 클리핑 실행
3. 우선순위 시스템을 통한 뉴스 랭킹
4. 슬랙으로 메시지 전송

### 3. 배포 및 활성화

```bash
# Vercel에 배포
vercel --prod

# 또는
npm run deploy
```

배포 후 Vercel 대시보드에서 Cron Jobs가 활성화됩니다.

## 🔧 수동 테스트

### 로컬에서 테스트
```bash
# 서버 실행
npm run dev

# Cron API 직접 호출
curl -X POST http://localhost:3000/api/cron-daily-news
```

### Vercel에서 테스트
```bash
# 프로덕션 API 직접 호출
curl -X POST https://your-domain.vercel.app/api/cron-daily-news
```

## 📊 모니터링

### Vercel 대시보드
1. Vercel 프로젝트 대시보드 접속
2. Functions 탭에서 Cron Jobs 확인
3. 실행 로그 및 상태 모니터링

### 로그 확인
```bash
# Vercel 로그 확인
vercel logs

# 특정 함수 로그 확인
vercel logs --function=cron-daily-news
```

## ⚠️ 주의사항

### 1. 시간대 설정
- Cron Job은 UTC 시간을 기준으로 실행됩니다
- 한국 시간 오전 11시 = UTC 오전 2시
- 서머타임이 적용되는 경우 시간 조정 필요

### 2. API 제한
- Vercel Hobby 플랜: 월 100회 무료
- Vercel Pro 플랜: 월 1,000회 무료
- 매일 1회 실행 시 월 31회 사용

### 3. 환경 변수
다음 환경 변수가 설정되어 있어야 합니다:
- `OPENAI_API_KEY`: OpenAI API 키
- `SLACK_WEBHOOK_URL`: Slack Webhook URL

## 🛠️ 문제 해결

### Cron Job이 실행되지 않는 경우
1. Vercel 프로젝트가 올바르게 배포되었는지 확인
2. `vercel.json` 파일의 Cron 설정 확인
3. Vercel 대시보드에서 Cron Jobs 상태 확인
4. API 엔드포인트가 정상 작동하는지 테스트

### 슬랙 메시지가 전송되지 않는 경우
1. `SLACK_WEBHOOK_URL` 환경 변수 확인
2. Slack Webhook이 활성화되어 있는지 확인
3. API 로그에서 에러 메시지 확인

### OpenAI API 오류
1. `OPENAI_API_KEY` 환경 변수 확인
2. API 키의 유효성 및 할당량 확인
3. 네트워크 연결 상태 확인

## 📝 추가 설정

### 다른 시간에 실행하고 싶은 경우
`vercel.json`의 `schedule` 값을 수정:

```json
// 매일 오후 3시 (한국 시간)
"schedule": "0 6 * * *"

// 매일 오후 6시 (한국 시간)
"schedule": "0 9 * * *"

// 매일 자정 (한국 시간)
"schedule": "0 15 * * *"
```

### 여러 번 실행하고 싶은 경우
```json
"crons": [
  {
    "path": "/api/cron-daily-news",
    "schedule": "0 2 * * *"
  },
  {
    "path": "/api/cron-daily-news",
    "schedule": "0 14 * * *"
  }
]
```

## 🎯 최종 확인 체크리스트

- [ ] `vercel.json`에 Cron Job 설정 완료
- [ ] `/api/cron-daily-news` API 엔드포인트 구현 완료
- [ ] 환경 변수 설정 완료 (`OPENAI_API_KEY`, `SLACK_WEBHOOK_URL`)
- [ ] Vercel에 배포 완료
- [ ] Vercel 대시보드에서 Cron Jobs 활성화 확인
- [ ] 수동 테스트로 API 정상 작동 확인
- [ ] 슬랙 메시지 전송 테스트 완료

모든 설정이 완료되면 매일 오전 11시에 자동으로 AI 뉴스가 슬랙으로 전송됩니다! 🎉 