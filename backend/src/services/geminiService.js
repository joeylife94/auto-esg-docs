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
    
    각 섹션은 2-3문장으로 간결하게 작성하되, 구체적인 내용을 포함해주세요.
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
  try {
    // API 키가 없는 경우 샘플 응답 반환
    if (!API_KEY) {
      console.warn('GEMINI_API_KEY is not set. Returning sample content.');
      return getSampleContent(reportData);
    }
    
    // 프롬프트 생성
    const prompt = generatePrompt(reportData);
    
    // Gemini 모델 설정
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // 컨텐츠 생성
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // 에러 발생 시 샘플 응답 반환
    return getSampleContent(reportData);
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
  
  return contents[category] || `${companyName}의 ${year}년 ESG 보고서입니다. ${toneStyle[tone]} 내용이 여기에 표시됩니다.`;
}; 