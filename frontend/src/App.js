import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ReportPreview from './components/ReportPreview';
import { generateReport, checkServerStatus, generateSampleReport } from './services/geminiService';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [currentFormData, setCurrentFormData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);

  // 서버 상태 확인
  useEffect(() => {
    const checkServer = async () => {
      const status = await checkServerStatus();
      setServerStatus(status);
    };
    
    checkServer();
    // 30초마다 서버 상태 확인
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  // 폼 데이터 업데이트 핸들러 (실시간 미리보기용)
  const handleFormDataChange = (formData) => {
    setCurrentFormData(formData);
    setError(null); // 폼 데이터가 변경되면 이전 오류 제거
  };

  // 실제 보고서 생성 핸들러
  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log('보고서 생성 요청 데이터:', formData);
      
      let content;
      
      // 서버 상태에 따라 처리 방식 결정
      if (serverStatus?.status === 'error') {
        console.warn('백엔드 서버가 실행되지 않아 샘플 보고서를 생성합니다.');
        content = generateSampleReport(formData);
        setSuccess('샘플 보고서가 생성되었습니다. 실제 AI 보고서를 받으려면 백엔드 서버를 실행해주세요.');
      } else {
        try {
          content = await generateReport(formData);
          setSuccess('AI를 통해 맞춤형 ESG 보고서가 성공적으로 생성되었습니다!');
        } catch (apiError) {
          console.warn('API 호출 실패, 샘플 보고서로 대체:', apiError.message);
          content = generateSampleReport(formData);
          setSuccess('샘플 보고서가 생성되었습니다. ' + apiError.message);
        }
      }
      
      setReportContent(content);
      setCurrentFormData(formData);
      
    } catch (error) {
      console.error('보고서 생성 오류:', error);
      setError(error.message || '보고서 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 오류 메시지 닫기
  const dismissError = () => setError(null);
  const dismissSuccess = () => setSuccess(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ESG 보고서 생성기</h1>
                <p className="text-gray-600 mt-1">AI 기반 맞춤형 ESG 보고서 자동 생성 플랫폼</p>
              </div>
            </div>
            
            {/* 서버 상태 표시 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  serverStatus?.status === 'ok' ? 'bg-green-500 animate-pulse' : 
                  serverStatus?.status === 'error' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {serverStatus?.status === 'ok' ? 'AI 서버 연결됨' : 
                   serverStatus?.status === 'error' ? '샘플 모드' : '상태 확인 중...'}
                </span>
              </div>
              
              {isLoading && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-sm font-medium">생성 중...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 알림 메시지 */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">오류 발생</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={dismissError}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 font-medium">성공</p>
                  <p className="text-sm text-green-600 mt-1">{success}</p>
                </div>
              </div>
              <button
                onClick={dismissSuccess}
                className="text-green-400 hover:text-green-600 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 서버 상태 안내 */}
      {serverStatus?.status === 'error' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 font-medium">샘플 모드로 실행 중</p>
                <p className="text-sm text-blue-600 mt-1">
                  백엔드 서버가 실행되지 않아 샘플 보고서를 제공합니다. 
                  AI 맞춤형 보고서를 받으려면 <code className="bg-blue-100 px-1 rounded">npm start</code>로 백엔드 서버를 실행해주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 사용 가이드 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 시작하기</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">1</span>
                <h3 className="font-semibold text-gray-900">정보 입력</h3>
              </div>
              <p className="text-sm text-gray-600">회사명, 연도, ESG 카테고리를 선택하세요</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">2</span>
                <h3 className="font-semibold text-gray-900">문체 선택</h3>
              </div>
              <p className="text-sm text-gray-600">보고서의 톤과 스타일을 결정하세요</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">3</span>
                <h3 className="font-semibold text-gray-900">데이터 입력</h3>
              </div>
              <p className="text-sm text-gray-600">수치 데이터와 목표를 입력하세요</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">4</span>
                <h3 className="font-semibold text-gray-900">보고서 생성</h3>
              </div>
              <p className="text-sm text-gray-600">미리보기 확인 후 PDF 다운로드</p>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 입력 폼 */}
          <div className="space-y-6">
            <InputForm 
              onSubmit={handleFormSubmit} 
              onFormDataChange={handleFormDataChange}
              onPreviewUpdate={handleFormDataChange}
              isLoading={isLoading}
            />
          </div>

          {/* 보고서 미리보기 */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ReportPreview 
              reportData={{
                ...currentFormData,
                generatedContent: reportContent
              }}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* 기능 소개 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">✨ 주요 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI 기반 생성</h3>
              <p className="text-gray-600">Google Gemini AI를 활용하여 전문적이고 맞춤형 ESG 보고서를 자동 생성합니다.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">실시간 미리보기</h3>
              <p className="text-gray-600">입력한 데이터를 바탕으로 실시간으로 보고서 미리보기와 성과 분석을 제공합니다.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF 다운로드</h3>
              <p className="text-gray-600">완성된 보고서를 전문적인 PDF 형태로 다운로드하여 바로 활용할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 ESG 보고서 생성기. AI 기반 지속가능성 보고서 솔루션.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Google Gemini AI • React • Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 