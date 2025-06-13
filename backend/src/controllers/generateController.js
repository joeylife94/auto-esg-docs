const geminiService = require('../services/geminiService');

/**
 * ESG 보고서 생성 컨트롤러
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.generateReport = async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  console.log('\n🌟 ====== ESG 보고서 생성 요청 ======');
  console.log(`🔍 요청 ID: ${requestId}`);
  console.log(`📅 요청 시간: ${new Date().toISOString()}`);
  console.log(`🌐 클라이언트 IP: ${req.ip || req.connection.remoteAddress}`);
  console.log(`🔗 요청 URL: ${req.method} ${req.originalUrl}`);
  console.log('📨 요청 헤더:', JSON.stringify(req.headers, null, 2));
  
  try {
    const reportData = req.body;
    console.log('📋 요청 본문:', JSON.stringify(reportData, null, 2));
    
    // 필수 필드 검증
    const requiredFields = ['category', 'companyName', 'year', 'tone'];
    const missingFields = requiredFields.filter(field => !reportData[field]);
    
    if (missingFields.length > 0) {
      const duration = Date.now() - startTime;
      
      console.log('❌ 입력 검증 실패');
      console.log(`🚫 누락된 필드: ${missingFields.join(', ')}`);
      console.log(`⏱️  처리 시간: ${duration}ms`);
      console.log('====== 요청 처리 실패 ======\n');
      
      return res.status(400).json({ 
        error: `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
        missingFields: missingFields
      });
    }
    
    console.log('✅ 입력 검증 통과');
    console.log(`📊 요청 데이터 요약:`);
    console.log(`   - 회사명: ${reportData.companyName}`);
    console.log(`   - 연도: ${reportData.year}`);
    console.log(`   - 카테고리: ${reportData.category}`);
    console.log(`   - 문체: ${reportData.tone}`);
    console.log(`   - 추가 요구사항: ${reportData.customPrompt ? '있음' : '없음'}`);
    
    // Gemini API를 통한 보고서 생성
    console.log('🤖 AI 서비스 호출 시작...');
    const aiStartTime = Date.now();
    
    const content = await geminiService.generateContent(reportData);
    
    const aiDuration = Date.now() - aiStartTime;
    const totalDuration = Date.now() - startTime;
    
    console.log('🎉 보고서 생성 성공!');
    console.log(`📊 응답 통계:`);
    console.log(`   - AI 서비스 처리 시간: ${aiDuration}ms`);
    console.log(`   - 총 처리 시간: ${totalDuration}ms`);
    console.log(`   - 생성된 콘텐츠 길이: ${content.length}자`);
    console.log(`   - 예상 단어 수: ${content.split(' ').length}개`);
    console.log(`   - 응답 크기: ${JSON.stringify({content}).length} bytes`);
    
    console.log('📄 생성된 콘텐츠 미리보기:');
    console.log('-------------------');
    console.log(content.substring(0, 150) + (content.length > 150 ? '...' : ''));
    console.log('-------------------');
    
    const response = { 
      content,
      metadata: {
        requestId,
        processedAt: new Date().toISOString(),
        processingTime: totalDuration,
        aiProcessingTime: aiDuration,
        contentLength: content.length
      }
    };
    
    console.log('✅ 응답 전송 완료');
    console.log('====== ESG 보고서 생성 완료 ======\n');
    
    return res.status(200).json(response);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.log('💥 예상치 못한 오류 발생');
    console.log(`⏱️  오류까지 소요 시간: ${duration}ms`);
    console.log('🔍 오류 상세 정보:');
    console.log(`   - 오류 이름: ${error.name}`);
    console.log(`   - 오류 메시지: ${error.message}`);
    console.log(`   - 스택 트레이스:`);
    console.log(error.stack);
    
    const errorResponse = {
      error: '보고서 생성 중 오류가 발생했습니다.',
      requestId,
      timestamp: new Date().toISOString(),
      processingTime: duration
    };
    
    console.log('📤 오류 응답 전송:', JSON.stringify(errorResponse, null, 2));
    console.log('====== 오류 처리 완료 ======\n');
    
    return res.status(500).json(errorResponse);
  }
}; 