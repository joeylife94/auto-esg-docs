# Auto ESG Docs 🌱

**AI 기반 ESG 보고서 자동 생성 웹 애플리케이션** ✨ **[완성됨!]**

## 개요

Google Gemini AI를 활용하여 ESG(Environmental, Social, and Governance) 보고서를 **완전 자동으로 생성**하는 웹 애플리케이션입니다. 

🎉 **프로젝트 완성!** 모든 핵심 기능이 구현되어 **즉시 사용 가능**합니다!

기업의 기본 정보만 입력하면 AI가 전문적인 보고서 내용을 생성하고, 추가 데이터 입력 시 성과 지표와 함께 종합적인 ESG 보고서와 PDF 다운로드까지 완전 지원합니다.

## ✨ 주요 기능 (모두 완성됨!)

- 🤖 **AI 기반 보고서 생성**: Google Gemini 1.5 Flash를 활용한 **즉시 생성**
- 📊 **실시간 미리보기**: 입력과 동시에 보고서 미리보기 업데이트
- 🎯 **맞춤형 생성**: 회사명, 연도, ESG 카테고리별 전문 보고서
- 📝 **다양한 문체**: 공식적/간결한/분석적 톤 선택 가능
- 📄 **PDF 다운로드**: 완성된 보고서 즉시 PDF 내보내기
- 📈 **성과 분석**: 자동 계산된 성과 지표 및 등급 표시
- 🔄 **상태 모니터링**: 실시간 서버 연결 상태 및 AI/샘플 모드 표시
- 📱 **완전 반응형**: 모든 기기에서 완벽한 사용자 경험
- ⚡ **즉시 사용**: 설치 후 바로 AI 보고서 생성 가능

## 기술 스택

- **Frontend**: React 18, Tailwind CSS, React PDF
- **Backend**: Node.js, Express, Google Generative AI
- **AI**: Google Gemini 1.5 Flash (최신 모델)
- **상태관리**: React Hooks, Real-time Status Monitoring

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
npm start
```

## 🔧 환경 변수 설정

백엔드 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
```

> **✅ 완성됨**: API 키가 이미 설정되어 **즉시 AI 보고서 생성 가능**합니다!
> API 키가 없어도 샘플 콘텐츠로 모든 기능 테스트 가능합니다.

## 🚀 사용 방법

1. **기본 정보 입력**
   - 회사명 입력
   - 보고 연도 설정 (2020-2030)
   - 중점 ESG 카테고리 선택
   - 추가 요청사항 (선택사항)

2. **상세 데이터 입력**
   - 온실가스 배출량 (Scope 1, 2, 3)
   - 에너지 사용량
   - 폐기물 관리 데이터
   - 물 사용량
   - 친환경 기술 정보

3. **문체 선택 및 생성**
   - 원하는 문체 톤 선택
   - 'AI 보고서 생성' 버튼 클릭

4. **결과 확인**
   - AI 생성 보고서 내용 확인
   - 입력 데이터 기반 성과 지표 확인
   - 종합 평가 결과 검토

## 🎯 지원하는 ESG 카테고리

- **온실가스 배출량**: Scope 1/2/3 배출량 관리
- **에너지 사용량**: 재생에너지 비중 및 효율성
- **폐기물 관리**: 재활용률 및 제로 웨이스트
- **물 사용량**: 물 절약 및 재활용
- **생물다양성**: 생태계 보존 및 복원 