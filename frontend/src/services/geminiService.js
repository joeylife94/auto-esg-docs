import axios from 'axios';

// Gemini API 호출을 위한 기본 URL
const API_URL = 'http://localhost:5000/api/generate';

/**
 * Gemini API를 호출하여 ESG 보고서 내용을 생성합니다.
 * 
 * @param {Object} reportData - 보고서 생성에 필요한 데이터
 * @param {string} reportData.category - ESG 카테고리 (온실가스, 에너지 등)
 * @param {string} reportData.companyName - 회사명
 * @param {number} reportData.year - 보고 연도
 * @param {string} reportData.tone - 문체 톤 (formal, concise, analytical)
 * @param {string} reportData.customPrompt - 추가 지시사항 (선택사항)
 * @returns {Promise<string>} - 생성된 보고서 내용
 */
export const generateReport = async (reportData) => {
  try {
    const response = await axios.post(API_URL, reportData);
    return response.data.content;
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error('보고서 생성 중 오류가 발생했습니다.');
  }
};

/**
 * 프롬프트 템플릿을 생성합니다.
 * 
 * @param {Object} reportData - 보고서 데이터
 * @returns {string} - 생성된 프롬프트
 */
export const generatePrompt = (reportData) => {
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

export default {
  generateReport,
  generatePrompt,
}; 