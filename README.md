# Auto ESG Docs

자동 ESG 문서 생성 프로젝트입니다.

## 개요

이 프로젝트는 ESG(Environmental, Social, and Governance) 관련 문서를 자동으로 생성하는 도구입니다. 사용자 입력값을 바탕으로 Gemini API를 호출하여 ESG 보고서를 자동 생성하고, PDF로 다운로드할 수 있는 기능을 제공합니다.

## 기능

- ESG 보고서 자동 생성
- 다양한 ESG 카테고리 지원 (온실가스, 에너지, 폐기물, 물 사용량, 생물다양성)
- 문체 톤 선택 (공식적, 간결, 분석적)
- 보고서 미리보기
- PDF 다운로드

## 기술 스택

- **Frontend**: React, Tailwind CSS, @react-pdf/renderer
- **Backend**: Node.js, Express
- **API**: Google Generative AI (Gemini Pro)

## 시작하기

### 사전 요구사항

- Node.js 14.x 이상
- Google AI Studio API 키 (Gemini Pro)

### 설치 방법

1. 저장소 클론

```bash
git clone https://github.com/joeylife94/auto-esg-docs.git
cd auto-esg-docs
```

2. 프론트엔드 설치 및 실행

```bash
cd frontend
npm install
npm start
```

3. 백엔드 설치 및 실행

```bash
cd backend
npm install
# .env 파일 생성 후 GEMINI_API_KEY 설정
npm run dev
```

## 환경 변수 설정

백엔드 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

## 사용 방법

1. 웹 브라우저에서 http://localhost:3000 접속
2. 회사명, ESG 카테고리, 보고 연도, 문체 톤 등 정보 입력
3. '보고서 생성' 버튼 클릭
4. 생성된 보고서 확인 및 PDF 다운로드 