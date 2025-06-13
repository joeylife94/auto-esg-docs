import axios from 'axios';

// Gemini API 호출을 위한 기본 URL (포트를 8000으로 변경)
const API_URL = 'http://localhost:8000/api/generate';

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
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  console.log('\n🚀 ====== 프론트엔드 API 호출 시작 ======');
  console.log(`🔍 요청 ID: ${requestId}`);
  console.log(`⏰ 시작 시간: ${new Date().toISOString()}`);
  console.log(`🌐 API URL: ${API_URL}`);
  console.log('📋 전송할 데이터:', JSON.stringify(reportData, null, 2));
  
  try {
    // 요청 데이터 검증
    console.log('🔍 데이터 검증 중...');
    if (!reportData.companyName || !reportData.year || !reportData.category || !reportData.tone) {
      const missingFields = [];
      if (!reportData.companyName) missingFields.push('회사명');
      if (!reportData.year) missingFields.push('연도');
      if (!reportData.category) missingFields.push('카테고리');
      if (!reportData.tone) missingFields.push('문체');
      
      console.log(`❌ 데이터 검증 실패: ${missingFields.join(', ')} 누락`);
      throw new Error(`필수 필드가 누락되었습니다: ${missingFields.join(', ')}`);
    }
    
    console.log('✅ 데이터 검증 통과');
    console.log(`📊 요청 데이터 요약:`);
    console.log(`   - 회사명: ${reportData.companyName}`);
    console.log(`   - 연도: ${reportData.year}`);
    console.log(`   - 카테고리: ${reportData.category}`);
    console.log(`   - 문체: ${reportData.tone}`);
    console.log(`   - 추가 요구사항: ${reportData.customPrompt ? reportData.customPrompt.substring(0, 50) + '...' : '없음'}`);

    // 백엔드 서버 연결 테스트
    console.log('🌐 백엔드 서버 호출 중...');
    const apiStartTime = Date.now();
    
    const response = await axios.post(API_URL, reportData, {
      timeout: 30000, // 30초 타임아웃
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const apiDuration = Date.now() - apiStartTime;
    const totalDuration = Date.now() - startTime;
    
    console.log(`✅ API 호출 성공! (${apiDuration}ms)`);
    console.log('📥 서버 응답 처리 중...');
    console.log('📊 응답 상태:', response.status, response.statusText);
    console.log('📨 응답 헤더:', JSON.stringify(response.headers, null, 2));

    if (!response.data || !response.data.content) {
      console.log('❌ 서버 응답 형식 오류');
      console.log('📄 받은 응답:', JSON.stringify(response.data, null, 2));
      throw new Error('서버에서 올바른 응답을 받지 못했습니다.');
    }

    const content = response.data.content;
    const metadata = response.data.metadata;
    
    console.log('🎉 보고서 생성 완료!');
    console.log(`📊 최종 통계:`);
    console.log(`   - 프론트엔드 총 처리 시간: ${totalDuration}ms`);
    console.log(`   - 백엔드 API 호출 시간: ${apiDuration}ms`);
    console.log(`   - 생성된 콘텐츠 길이: ${content.length}자`);
    console.log(`   - 서버 처리 시간: ${metadata?.processingTime || 'N/A'}ms`);
    console.log(`   - AI 처리 시간: ${metadata?.aiProcessingTime || 'N/A'}ms`);
    
    if (metadata) {
      console.log('🔍 서버 메타데이터:', JSON.stringify(metadata, null, 2));
    }
    
    console.log('📄 생성된 콘텐츠 미리보기:');
    console.log('-------------------');
    console.log(content.substring(0, 200) + (content.length > 200 ? '...' : ''));
    console.log('-------------------');
    console.log('====== 프론트엔드 API 호출 완료 ======\n');

    return content;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.log('❌ API 호출 실패');
    console.log(`⏱️  실패까지 소요 시간: ${duration}ms`);
    console.log('🔍 오류 상세 분석:');
    
    // 구체적인 오류 메시지 제공
    if (error.code === 'ECONNREFUSED') {
      console.log('🚫 연결 거부: 백엔드 서버가 실행되지 않음');
      console.log('💡 해결 방법: 백엔드 서버를 실행해주세요 (포트: 8000)');
      throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요. (포트: 8000)');
    } else if (error.code === 'ENOTFOUND') {
      console.log('🌐 DNS 오류: 서버 주소를 찾을 수 없음');
      console.log('💡 해결 방법: 네트워크 연결을 확인해주세요');
      throw new Error('서버 주소를 찾을 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else if (error.code === 'ECONNABORTED') {
      console.log('⏰ 타임아웃: 서버 응답 시간 초과');
      console.log('💡 해결 방법: 서버 상태를 확인하거나 잠시 후 다시 시도해주세요');
      throw new Error('서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
    } else if (error.response) {
      // 서버에서 응답이 왔지만 오류가 있는 경우
      const status = error.response.status;
      const message = error.response.data?.error || error.response.data?.message || '알 수 없는 서버 오류';
      
      console.log(`🔴 HTTP 오류 (${status}):`, message);
      console.log('📄 서버 오류 응답:', JSON.stringify(error.response.data, null, 2));
      
      if (status === 400) {
        console.log('📝 요청 데이터 문제: 필수 필드나 형식을 확인해주세요');
      } else if (status === 500) {
        console.log('🔧 서버 내부 오류: 백엔드 로그를 확인해주세요');
      } else if (status === 503) {
        console.log('🚫 서비스 이용 불가: 서버가 일시적으로 이용할 수 없습니다');
      }
      
      throw new Error(`서버 오류 (${status}): ${message}`);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.log('📡 요청 전송됨, 응답 없음');
      console.log('🔍 요청 정보:', error.request);
      throw new Error('서버에서 응답이 없습니다. 네트워크 연결이나 서버 상태를 확인해주세요.');
    } else {
      // 기타 오류
      console.log('💥 예상치 못한 오류:', error.message);
      console.log('📊 전체 오류 객체:', error);
      throw new Error(error.message || '보고서 생성 중 예상치 못한 오류가 발생했습니다.');
    }
  }
};

/**
 * 백엔드 서버 상태를 확인합니다.
 */
export const checkServerStatus = async () => {
  const startTime = Date.now();
  
  console.log('🔍 서버 상태 확인 시작...');
  
  try {
    const response = await axios.get('http://localhost:8000/', { timeout: 5000 }); // 포트를 8000으로 변경
    const duration = Date.now() - startTime;
    
    console.log(`✅ 서버 상태 확인 완료 (${duration}ms)`);
    console.log('📊 서버 응답:', response.status, response.statusText);
    console.log('📄 서버 메시지:', response.data);
    
    return { 
      status: 'ok', 
      message: '서버가 정상적으로 실행 중입니다.',
      responseTime: duration
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.log(`❌ 서버 상태 확인 실패 (${duration}ms)`);
    console.log('🔍 오류 정보:', error.code, error.message);
    
    return { 
      status: 'error', 
      message: error.code === 'ECONNREFUSED' 
        ? '백엔드 서버가 실행되지 않았습니다.' 
        : '서버 연결에 문제가 있습니다.',
      responseTime: duration,
      errorCode: error.code
    };
  }
};

/**
 * 샘플 보고서 내용을 생성합니다 (백엔드 서버가 없을 때 대체용)
 */
export const generateSampleReport = (reportData) => {
  const startTime = Date.now();
  
  console.log('📋 샘플 보고서 생성 시작...');
  console.log('📊 입력 데이터:', JSON.stringify(reportData, null, 2));
  
  const { category, companyName, year, tone } = reportData;
  
  const toneStyle = {
    formal: '공식적이고 전문적인',
    concise: '간결하고 명확한',
    analytical: '분석적이고 데이터 중심의',
  };
  
  const sampleContents = {
    greenhouse: `${companyName}은(는) ${year}년 온실가스 배출량 관리에 있어 ${toneStyle[tone]} 접근 방식을 채택했습니다. 
    
탄소 중립을 향한 여정에서 당사는 직접 배출(Scope 1) 및 간접 배출(Scope 2)을 모두 측정하고 관리하고 있습니다. 전년 대비 온실가스 배출량은 12% 감소했으며, 이는 재생 에너지 사용 증가와 에너지 효율성 향상 프로젝트의 결과입니다.

당사는 과학적 기반 감축 목표(SBTi)에 따라 2030년까지 2018년 대비 배출량 50% 감축을 목표로 설정했습니다. 이를 위해 재생 에너지 투자를 확대하고, 에너지 효율성 향상 프로젝트를 지속적으로 추진할 계획입니다.`,
    
    energy: `${companyName}의 ${year}년 에너지 사용량 보고서는 ${toneStyle[tone]} 내용을 담고 있습니다. 
    
당사는 총 에너지 소비량의 35%를 재생 가능 에너지원으로 전환했으며, 에너지 효율성 향상을 위한 시설 업그레이드를 통해 전체 에너지 소비를 전년 대비 8% 절감했습니다.

향후 5년간 에너지 효율성을 추가로 15% 개선하고 재생 에너지 비중을 60%까지 확대할 계획입니다. 이를 위해 태양광 발전 시설 투자와 에너지 관리 시스템 고도화를 추진하겠습니다.`,
    
    waste: `${companyName}은(는) ${year}년 폐기물 관리에 있어 ${toneStyle[tone]} 전략을 구현했습니다. 
    
매립 폐기물을 25% 감소시켰으며, 재활용률은 65%로 향상되었습니다. 제로 웨이스트 이니셔티브를 통해 생산 공정에서 발생하는 폐기물의 재사용 및 업사이클링을 촉진하고 있습니다.

${year+2}년까지 매립 폐기물 제로화를 목표로 하며, 이를 위해 순환 경제 원칙을 적용한 제품 설계와 공급망 전반의 폐기물 감축 프로그램을 확대할 예정입니다.`,
    
    water: `${companyName}의 ${year}년 물 사용량 관리는 ${toneStyle[tone]} 접근법을 보여줍니다. 
    
물 사용량을 전년 대비 15% 절감했으며, 폐수 재활용 시스템을 도입하여 생산 공정에서 사용되는 물의 40%를 재사용하고 있습니다. 또한 지역 수자원 보호 프로젝트에 참여하여 지역사회와의 상생을 도모하고 있습니다.

향후 당사는 물 스트레스가 높은 지역에서의 물 사용량을 30% 추가 절감하고, 모든 생산 시설에 폐수 재활용 시스템을 도입하여 물 재사용률 70%를 달성하겠습니다.`,
  };
  
  const selectedContent = sampleContents[category] || `${companyName}의 ${year}년 ESG 보고서입니다. ${toneStyle[tone]} 내용이 여기에 표시됩니다.`;
  
  const duration = Date.now() - startTime;
  
  console.log('✅ 샘플 보고서 생성 완료');
  console.log(`⏱️  처리 시간: ${duration}ms`);
  console.log(`📄 생성된 콘텐츠 길이: ${selectedContent.length}자`);
  console.log(`📊 카테고리: ${category}, 문체: ${tone}`);
  
  return selectedContent;
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
    
    각 섹션은 2-3문단으로 구체적이고 전문적으로 작성해주세요.
  `;
  
  if (customPrompt) {
    prompt += `\n\n추가 요구사항: ${customPrompt}`;
  }
  
  return prompt;
};

export default {
  generateReport,
  generatePrompt,
  checkServerStatus,
  generateSampleReport,
}; 