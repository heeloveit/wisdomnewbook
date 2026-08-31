# 위즈덤하우스 SNS 카피 생성기 (웹사이트 버전 · 무료)

Claude.ai 없이 독립적으로 작동하는 웹사이트입니다.
`public/index.html`이 화면(프론트엔드), `api/generate.js`가 API 키를 안전하게 보관하고
Google Gemini API(무료 티어)를 호출해주는 서버 역할(백엔드)을 합니다.

## 폴더 구조
```
wisdomhouse-site/
├── public/
│   └── index.html      ← 사용자가 보는 화면
├── api/
│   └── generate.js      ← API 키를 숨겨서 Gemini를 호출하는 서버 함수
├── package.json
└── .env.example
```

## 1단계. 무료 Gemini API 키 발급받기

1. https://aistudio.google.com 접속 (구글 계정으로 로그인)
2. 왼쪽 메뉴에서 "Get API key" 클릭
3. "Create API key" 클릭 → 신용카드 등록이나 결제 정보 없이 바로 키가 생성돼요
4. `AIza...`로 시작하는 키 값을 복사해두기

**무료 티어 참고사항**
- 신용카드 등록 없이 상시 무료로 사용 가능 (하루 요청 수, 분당 요청 수에 제한이 있어요. 주 1회 몇 개 생성하는 정도의 사용량이면 충분해요)
- 무료 티어에서는 구글이 입력 내용을 모델 개선 목적으로 활용할 수 있어요. 민감하거나 엠바고가 걸린 자료라면 이 점을 감안해주세요
- 사용량이 많아지면 결제 계정을 연결해서 유료 등급으로 올릴 수 있어요 (지금 단계에선 필요 없어요)

## 2단계. Vercel에 배포하기 (무료)

### 방법 A. GitHub 없이 바로 올리기 (가장 쉬움)
1. https://vercel.com 접속 후 이메일/구글 계정으로 가입 (무료)
2. 대시보드에서 "Add New... → Project" 클릭
3. "Deploy without Git" 또는 업로드 영역에 이 폴더(`wisdomhouse-site`) 전체를 드래그 앤 드롭
4. 배포가 시작되면 잠시 기다렸다가 프로젝트 화면으로 이동

### 방법 B. GitHub 저장소 연동 (팀에서 계속 수정할 예정이면 추천)
1. 이 폴더를 GitHub 저장소로 올리기
2. https://vercel.com 에서 "Add New... → Project" → 방금 만든 저장소 선택 → Deploy

## 3단계. API 키 등록 (꼭 해야 작동해요)
1. Vercel 프로젝트 화면에서 **Settings → Environment Variables** 로 이동
2. Key: `GEMINI_API_KEY` / Value: 발급받은 `AIza...` 키 값 입력 후 저장
3. 상단 **Deployments** 탭에서 최근 배포 옆 점 3개(⋯) 클릭 → **Redeploy** (환경변수는 재배포해야 반영돼요)

이후 발급되는 `https://프로젝트이름.vercel.app` 주소를 팀원들에게 공유하면
누구나 브라우저에서 바로 접속해서 사용할 수 있어요. 구글/Claude 계정도 필요 없습니다.

## 무료 한도를 넘기면?
사용량이 늘어서 무료 한도(요청 제한)에 걸리면 아이스튜디오(aistudio.google.com)에서
결제 계정을 연결해 유료로 전환할 수 있어요. 그 전까지는 완전히 무료로 운영 가능해요.

## 톤이나 디자인을 수정하고 싶다면
- **문구 생성 톤**: `api/generate.js` 안의 `TONE_SYSTEM_PROMPT` 텍스트를 수정
- **화면 디자인**: `public/index.html` 안의 `<style>` 부분을 수정
