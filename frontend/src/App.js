import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ReportPreview from './components/ReportPreview';
import './App.css';

function App() {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (data) => {
    setIsLoading(true);
    // API 호출은 실제 백엔드 연결 시 구현
    // 여기서는 임시로 타임아웃을 사용하여 로딩 상태 시뮬레이션
    setTimeout(() => {
      setReportData(data);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">ESG 보고서 자동 생성</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            <ReportPreview reportData={reportData} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App; 