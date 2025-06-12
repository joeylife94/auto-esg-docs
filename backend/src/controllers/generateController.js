const geminiService = require('../services/geminiService');

/**
 * ESG 보고서 생성 컨트롤러
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
exports.generateReport = async (req, res) => {
  try {
    const reportData = req.body;
    
    // 필수 필드 검증
    if (!reportData.category || !reportData.companyName || !reportData.year || !reportData.tone) {
      return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }
    
    // Gemini API를 통한 보고서 생성
    const content = await geminiService.generateContent(reportData);
    
    return res.status(200).json({ content });
  } catch (error) {
    console.error('Error in generateReport controller:', error);
    return res.status(500).json({ error: '보고서 생성 중 오류가 발생했습니다.' });
  }
}; 