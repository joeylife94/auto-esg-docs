const { GoogleGenerativeAI } = require('@google/generative-ai');

// Gemini API 설정
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * 프롬프트 템플릿을 생성합니다.
 * 
 * @param {Object} reportData - 보고서 데이터
 * @returns {string} - 생성된 프롬프트
 */
const generatePrompt = (reportData) => {
  const { category, companyName, year, tone, customPrompt } = reportData;
  
  const categoryLabels = {
    greenhouse: '온실가스 배출량',
    energy: '에너지 사용량',
    waste: '폐기물 관리',
    water: '물 사용량',
    biodiversity: '생물다양성',
  };
  
  const toneInstructions = {
    formal: '공식적이고 전문적인 톤으로 작성하세요. 전문 용어를 적절히 사용하고 객관적인 사실을 중심으로 서술하세요.',
    concise: '간결하고 명확한 톤으로 작성하세요. 핵심 내용만 포함하고 불필요한 설명은 제외하세요.',
    analytical: '분석적이고 데이터 중심의 톤으로 작성하세요. 수치와 통계를 활용하여 논리적으로 서술하세요.',
  };
  
  let prompt = `
    ${companyName}의 ${year}년 ESG 보고서 중 ${categoryLabels[category] || category} 섹션을 작성해주세요.
    
    ${toneInstructions[tone] || ''}
    
    다음 구조로 작성해주세요:
    1. 해당 ESG 영역에 대한 회사의 접근 방식 소개
    2. 주요 성과와 지표
    3. 향후 목표와 계획
    
    각 섹션은 2-3문단으로 구체적이고 전문적으로 작성해주세요.
  `;
  
  if (customPrompt) {
    prompt += `\n\n추가 요구사항: ${customPrompt}`;
  }
  
  return prompt;
};

/**
 * Gemini API를 사용하여 ESG 보고서 내용을 생성합니다.
 * 
 * @param {Object} reportData - 보고서 데이터
 * @returns {Promise<string>} - 생성된 보고서 내용
 */
exports.generateContent = async (reportData) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  console.log('\n====== Gemini API 호출 시작 ======');
  console.log(`🔍 요청 ID: ${requestId}`);
  console.log(`⏰ 시작 시간: ${new Date().toISOString()}`);
  console.log('📋 요청 데이터:', JSON.stringify(reportData, null, 2));
  
  try {
    // API 키 검증
    if (!API_KEY) {
      console.log('⚠️  GEMINI_API_KEY가 설정되지 않음 - 샘플 모드로 전환');
      console.log('💡 실제 AI 응답을 받으려면 .env 파일에 GEMINI_API_KEY를 설정하세요');
      
      const sampleContent = getSampleContent(reportData);
      const duration = Date.now() - startTime;
      
      console.log('✅ 샘플 응답 생성 완료');
      console.log(`⏱️  처리 시간: ${duration}ms`);
      console.log(`📄 응답 길이: ${sampleContent.length}자`);
      console.log('====== 샘플 모드 완료 ======\n');
      
      return sampleContent;
    }
    
    console.log('🔑 API Key 확인됨 - AI 모드로 진행');
    console.log(`🔑 API Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}`);
    
    // 프롬프트 생성
    const prompt = generatePrompt(reportData);
    console.log('📝 생성된 프롬프트:');
    console.log('-------------------');
    console.log(prompt);
    console.log('-------------------');
    
    // Gemini 모델 설정 - 최신 모델명 사용
    console.log('🤖 Gemini 모델 초기화 중...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('🚀 Gemini API 호출 중...');
    const apiStartTime = Date.now();
    
    // 컨텐츠 생성
    const result = await model.generateContent(prompt);
    const apiDuration = Date.now() - apiStartTime;
    
    console.log(`✅ API 호출 완료 (${apiDuration}ms)`);
    console.log('📥 API 응답 처리 중...');
    
    const response = await result.response;
    const text = response.text();
    
    const totalDuration = Date.now() - startTime;
    
    console.log('🎉 AI 보고서 생성 성공!');
    console.log(`📊 응답 통계:`);
    console.log(`   - 총 처리 시간: ${totalDuration}ms`);
    console.log(`   - API 호출 시간: ${apiDuration}ms`);
    console.log(`   - 응답 길이: ${text.length}자`);
    console.log(`   - 단어 수 (추정): ${text.split(' ').length}개`);
    console.log('📄 생성된 내용 미리보기:');
    console.log('-------------------');
    console.log(text.substring(0, 200) + (text.length > 200 ? '...' : ''));
    console.log('-------------------');
    console.log('====== Gemini API 호출 완료 ======\n');
    
    return text;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.log('❌ Gemini API 호출 실패');
    console.log(`⏱️  실패까지 소요 시간: ${duration}ms`);
    console.log('🔍 오류 상세 정보:');
    
    if (error.status) {
      console.log(`   - HTTP 상태: ${error.status}`);
    }
    if (error.message) {
      console.log(`   - 오류 메시지: ${error.message}`);
    }
    if (error.code) {
      console.log(`   - 오류 코드: ${error.code}`);
    }
    
    console.log('📊 전체 오류 객체:', error);
    
    // 특정 오류 유형별 처리
    if (error.status === 403) {
      console.log('🔑 API 키 권한 문제 - API 키를 확인하세요');
    } else if (error.status === 429) {
      console.log('🚫 API 호출 한도 초과 - 잠시 후 다시 시도하세요');
    } else if (error.status === 400) {
      console.log('📝 요청 형식 문제 - 프롬프트를 확인하세요');
    }
    
    console.log('🔄 샘플 응답으로 대체합니다...');
    
    const sampleContent = getSampleContent(reportData);
    
    console.log('✅ 샘플 응답 생성 완료');
    console.log(`📄 샘플 응답 길이: ${sampleContent.length}자`);
    console.log('====== API 오류 처리 완료 ======\n');
    
    return sampleContent;
  }
};

/**
 * 샘플 ESG 보고서 내용을 생성합니다.
 * API 호출이 실패하거나 API 키가 없는 경우 사용됩니다.
 * 
 * @param {Object} reportData - 보고서 데이터
 * @returns {string} - 샘플 보고서 내용
 */
const getSampleContent = (reportData) => {
  const timestamp = new Date().toISOString();
  console.log(`📋 샘플 콘텐츠 생성 중... (${timestamp})`);
  
  const { category, companyName, year, tone } = reportData;
  
  const toneStyle = {
    formal: '공식적이고 전문적인',
    concise: '간결하고 명확한',
    analytical: '분석적이고 데이터 중심의',
  };
  
  const contents = {
    greenhouse: `${companyName}은(는) ${year}년 온실가스 배출량 관리에 있어 ${toneStyle[tone]} 접근 방식을 채택했습니다. 
    탄소 중립을 향한 여정에서 당사는 직접 배출(Scope 1) 및 간접 배출(Scope 2)을 모두 측정하고 관리하고 있습니다. 
    전년 대비 온실가스 배출량은 12% 감소했으며, 이는 재생 에너지 사용 증가와 에너지 효율성 향상 프로젝트의 결과입니다.
    
    당사는 과학적 기반 감축 목표(SBTi)에 따라 2030년까지 2018년 대비 배출량 50% 감축을 목표로 설정했습니다.
    이를 위해 재생 에너지 투자를 확대하고, 에너지 효율성 향상 프로젝트를 지속적으로 추진할 계획입니다.`,
    
    energy: `${companyName}의 ${year}년 에너지 사용량 보고서는 ${toneStyle[tone]} 내용을 담고 있습니다. 
    당사는 총 에너지 소비량의 35%를 재생 가능 에너지원으로 전환했으며, 
    에너지 효율성 향상을 위한 시설 업그레이드를 통해 전체 에너지 소비를 전년 대비 8% 절감했습니다.
    
    향후 5년간 에너지 효율성을 추가로 15% 개선하고 재생 에너지 비중을 60%까지 확대할 계획입니다.
    이를 위해 태양광 발전 시설 투자와 에너지 관리 시스템 고도화를 추진하겠습니다.`,
    
    waste: `${companyName}은(는) ${year}년 폐기물 관리에 있어 ${toneStyle[tone]} 전략을 구현했습니다. 
    매립 폐기물을 25% 감소시켰으며, 재활용률은 65%로 향상되었습니다. 
    제로 웨이스트 이니셔티브를 통해 생산 공정에서 발생하는 폐기물의 재사용 및 업사이클링을 촉진하고 있습니다.
    
    ${year+2}년까지 매립 폐기물 제로화를 목표로 하며, 이를 위해 순환 경제 원칙을 적용한 제품 설계와
    공급망 전반의 폐기물 감축 프로그램을 확대할 예정입니다.`,
    
    water: `${companyName}의 ${year}년 물 사용량 관리는 ${toneStyle[tone]} 접근법을 보여줍니다. 
    물 사용량을 전년 대비 15% 절감했으며, 폐수 재활용 시스템을 도입하여 생산 공정에서 사용되는 물의 40%를 재사용하고 있습니다. 
    또한 지역 수자원 보호 프로젝트에 참여하여 지역사회와의 상생을 도모하고 있습니다.
    
    향후 당사는 물 스트레스가 높은 지역에서의 물 사용량을 30% 추가 절감하고, 
    모든 생산 시설에 폐수 재활용 시스템을 도입하여 물 재사용률 70%를 달성하겠습니다.`,
    
    biodiversity: `${companyName}은(는) ${year}년 생물다양성 보존을 위해 ${toneStyle[tone]} 프로그램을 운영했습니다. 
    사업장 주변 자연 서식지 복원 프로젝트를 통해 지역 생태계를 지원하고, 
    공급망 전반에 걸쳐 생물다양성 영향 평가를 실시하여 부정적 영향을 최소화하기 위한 조치를 취하고 있습니다.
    
    ${year+3}년까지 모든 사업장 주변 5km 이내 지역의 생물다양성 순 증가를 목표로 하며,
    이를 위해 자연 기반 솔루션 투자와 생태계 복원 프로젝트를 확대할 계획입니다.`,
  };
  
  const selectedContent = contents[category] || `${companyName}의 ${year}년 ESG 보고서입니다. ${toneStyle[tone]} 내용이 여기에 표시됩니다.`;
  
  console.log(`✅ 샘플 콘텐츠 준비 완료 - 카테고리: ${category}, 길이: ${selectedContent.length}자`);
  
  return selectedContent;
}; 