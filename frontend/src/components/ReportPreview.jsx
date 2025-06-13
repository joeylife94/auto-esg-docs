import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const ReportPreview = ({ reportData, isLoading }) => {
  const [activeTab, setActiveTab] = useState('preview');

  // 계산 함수들
  const calculateReduction = (current, previous) => {
    if (!current || !previous || current === '' || previous === '') return 0;
    const currentNum = parseFloat(current);
    const previousNum = parseFloat(previous);
    return ((previousNum - currentNum) / previousNum * 100).toFixed(1);
  };

  const calculateTargetAchievement = (current, target) => {
    if (!current || !target || current === '' || target === '') return 0;
    const currentNum = parseFloat(current);
    const targetNum = parseFloat(target);
    return ((currentNum / targetNum) * 100).toFixed(1);
  };

  const calculatePercentage = (part, total) => {
    if (!part || !total || part === '' || total === '') return 0;
    const partNum = parseFloat(part);
    const totalNum = parseFloat(total);
    return ((partNum / totalNum) * 100).toFixed(1);
  };

  // 성과 등급 계산
  const getPerformanceGrade = (achievement) => {
    const score = parseFloat(achievement);
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 80) return { grade: 'A', color: 'text-green-500', bgColor: 'bg-green-50' };
    if (score >= 70) return { grade: 'B+', color: 'text-blue-500', bgColor: 'bg-blue-50' };
    if (score >= 60) return { grade: 'B', color: 'text-yellow-500', bgColor: 'bg-yellow-50' };
    return { grade: 'C', color: 'text-red-500', bgColor: 'bg-red-50' };
  };

  // PDF 스타일
  const pdfStyles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 30,
    },
    header: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
      color: '#1f2937',
      fontWeight: 'bold',
    },
    subHeader: {
      fontSize: 18,
      marginBottom: 15,
      marginTop: 20,
      color: '#374151',
      fontWeight: 'bold',
    },
    text: {
      fontSize: 12,
      marginBottom: 10,
      color: '#4b5563',
      lineHeight: 1.5,
    },
    section: {
      marginBottom: 20,
      padding: 15,
      backgroundColor: '#f9fafb',
      borderRadius: 5,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    label: {
      fontSize: 10,
      color: '#6b7280',
    },
    value: {
      fontSize: 12,
      color: '#1f2937',
      fontWeight: 'bold',
    }
  });

  // PDF 문서 컴포넌트
  const ESGReportPDF = () => (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <Text style={pdfStyles.header}>
          {reportData?.companyName || '회사명'} ESG 보고서 {reportData?.year || new Date().getFullYear()}
        </Text>

        {/* AI 생성 내용 */}
        {reportData?.generatedContent && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.subHeader}>AI 생성 보고서</Text>
            <Text style={pdfStyles.text}>{reportData.generatedContent}</Text>
          </View>
        )}

        {/* 온실가스 배출량 */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.subHeader}>온실가스 배출량 (톤 CO2e)</Text>
          
          <Text style={pdfStyles.text}>Scope 1 (직접 배출)</Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>전년도: {reportData?.scope1Emissions?.previousYear || 0}톤</Text>
            <Text style={pdfStyles.label}>금년도: {reportData?.scope1Emissions?.currentYear || 0}톤</Text>
            <Text style={pdfStyles.label}>감소율: {calculateReduction(reportData?.scope1Emissions?.currentYear, reportData?.scope1Emissions?.previousYear)}%</Text>
          </View>

          <Text style={pdfStyles.text}>Scope 2 (간접 배출)</Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>전년도: {reportData?.scope2Emissions?.previousYear || 0}톤</Text>
            <Text style={pdfStyles.label}>금년도: {reportData?.scope2Emissions?.currentYear || 0}톤</Text>
            <Text style={pdfStyles.label}>감소율: {calculateReduction(reportData?.scope2Emissions?.currentYear, reportData?.scope2Emissions?.previousYear)}%</Text>
          </View>

          <Text style={pdfStyles.text}>Scope 3 (기타 간접 배출)</Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>전년도: {reportData?.scope3Emissions?.previousYear || 0}톤</Text>
            <Text style={pdfStyles.label}>금년도: {reportData?.scope3Emissions?.currentYear || 0}톤</Text>
            <Text style={pdfStyles.label}>감소율: {calculateReduction(reportData?.scope3Emissions?.currentYear, reportData?.scope3Emissions?.previousYear)}%</Text>
          </View>
        </View>

        {/* 에너지 사용량 */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.subHeader}>에너지 사용량 (MWh)</Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>총 사용량: {reportData?.energyUsage?.totalUsage || 0}MWh</Text>
            <Text style={pdfStyles.label}>재생에너지: {reportData?.energyUsage?.renewableUsage || 0}MWh</Text>
            <Text style={pdfStyles.label}>재생에너지 비중: {calculatePercentage(reportData?.energyUsage?.renewableUsage, reportData?.energyUsage?.totalUsage)}%</Text>
          </View>
        </View>

        {/* 폐기물 관리 */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.subHeader}>폐기물 관리 (톤)</Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>총 배출량: {reportData?.wasteManagement?.totalWaste || 0}톤</Text>
            <Text style={pdfStyles.label}>재활용량: {reportData?.wasteManagement?.recycledWaste || 0}톤</Text>
            <Text style={pdfStyles.label}>재활용률: {calculatePercentage(reportData?.wasteManagement?.recycledWaste, reportData?.wasteManagement?.totalWaste)}%</Text>
          </View>
        </View>

        {/* 물 사용량 */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.subHeader}>물 사용량 (m³)</Text>
          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>전년도: {reportData?.waterUsage?.previousYear || 0}m³</Text>
            <Text style={pdfStyles.label}>금년도: {reportData?.waterUsage?.currentYear || 0}m³</Text>
            <Text style={pdfStyles.label}>절감률: {calculateReduction(reportData?.waterUsage?.currentYear, reportData?.waterUsage?.previousYear)}%</Text>
          </View>
        </View>

        {/* 친환경 기술 */}
        {reportData?.ecoFriendlyTech?.name && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.subHeader}>친환경 기술</Text>
            <Text style={pdfStyles.text}>기술명: {reportData.ecoFriendlyTech.name}</Text>
            <Text style={pdfStyles.text}>도입일: {reportData.ecoFriendlyTech.implementationDate}</Text>
            <Text style={pdfStyles.text}>예상 효과: {reportData.ecoFriendlyTech.expectedImpact}</Text>
          </View>
        )}
      </Page>
    </Document>
  );

  if (!reportData && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 ESG 보고서 미리보기</h2>
        <div className="text-center text-gray-500 py-16">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">📊</span>
          </div>
          <p className="text-lg mb-2">입력 폼을 작성하여 AI 기반 ESG 보고서를 생성해보세요.</p>
          <p className="text-sm text-gray-400">실시간으로 미리보기가 업데이트됩니다.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 ESG 보고서 미리보기</h2>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 mb-2">AI가 전문적인 보고서를 생성 중입니다...</p>
          <p className="text-sm text-gray-400">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  // 종합 성과 계산
  const overallScore = (() => {
    const scores = [
      calculateTargetAchievement(reportData.scope1Emissions.currentYear, reportData.scope1Emissions.target),
      calculateTargetAchievement(reportData.scope2Emissions.currentYear, reportData.scope2Emissions.target),
      calculateTargetAchievement(reportData.scope3Emissions.currentYear, reportData.scope3Emissions.target),
      calculateTargetAchievement(reportData.energyUsage.renewableUsage, reportData.energyUsage.renewableTarget),
      calculateTargetAchievement(reportData.wasteManagement.recycledWaste, reportData.wasteManagement.recyclingTarget)
    ].filter(score => score > 0);
    
    return scores.length > 0 ? (scores.reduce((a, b) => a + parseFloat(b), 0) / scores.length).toFixed(1) : 0;
  })();

  const overallGrade = getPerformanceGrade(overallScore);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 ESG 보고서 미리보기</h2>
        
        {/* PDF 다운로드 버튼 */}
        {reportData && (
          <PDFDownloadLink
            document={<ESGReportPDF />}
            fileName={`${reportData.companyName || '회사'}_ESG보고서_${reportData.year || new Date().getFullYear()}.pdf`}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition-colors"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  PDF 생성 중...
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2">📄</span>
                  PDF 다운로드
                </div>
              )
            }
          </PDFDownloadLink>
        )}
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'preview'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📊 보고서 미리보기
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'analytics'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📈 성과 분석
        </button>
      </div>

      {activeTab === 'preview' && (
        <div>
          {/* 회사 정보 헤더 */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {reportData.companyName} ESG 보고서
                </h3>
                <p className="text-gray-600">보고 연도: {reportData.year}</p>
                <p className="text-gray-600">중점 분야: {reportData.category === 'greenhouse' ? '온실가스 배출량' : reportData.category === 'energy' ? '에너지 사용량' : reportData.category === 'waste' ? '폐기물 관리' : '물 사용량'}</p>
              </div>
              <div className={`px-4 py-2 rounded-full ${overallGrade.bgColor}`}>
                <span className={`text-lg font-bold ${overallGrade.color}`}>
                  {overallGrade.grade}
                </span>
              </div>
            </div>
          </div>

          {/* AI 생성 내용 섹션 */}
          {reportData.generatedContent && (
            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
                <span className="mr-2">🤖</span>
                AI 생성 보고서 내용
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-lg">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {reportData.generatedContent}
                </div>
              </div>
            </section>
          )}

          <hr className="my-8 border-gray-200" />
          
          <h3 className="text-lg font-semibold mb-6 text-gray-600">📊 입력 데이터 기반 성과 지표</h3>

          {/* 온실가스 배출량 섹션 */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              <span className="mr-2">🏭</span>
              온실가스 배출량 성과
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Scope 1 */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="text-lg font-medium mb-3 text-red-700 flex items-center">
                  <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">1</span>
                  Scope 1
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">전년도:</span>
                    <span className="font-medium">{reportData.scope1Emissions.previousYear || 0}톤</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">금년도:</span>
                    <span className="font-medium">{reportData.scope1Emissions.currentYear || 0}톤</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">감소율:</span>
                    <span className={`font-bold ${parseFloat(calculateReduction(reportData.scope1Emissions.currentYear, reportData.scope1Emissions.previousYear)) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculateReduction(reportData.scope1Emissions.currentYear, reportData.scope1Emissions.previousYear)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">목표 달성률:</span>
                    <span className="font-bold text-blue-600">
                      {calculateTargetAchievement(reportData.scope1Emissions.currentYear, reportData.scope1Emissions.target)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Scope 2 */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="text-lg font-medium mb-3 text-yellow-700 flex items-center">
                  <span className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">2</span>
                  Scope 2
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">전년도:</span>
                    <span className="font-medium">{reportData.scope2Emissions.previousYear || 0}톤</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">금년도:</span>
                    <span className="font-medium">{reportData.scope2Emissions.currentYear || 0}톤</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">감소율:</span>
                    <span className={`font-bold ${parseFloat(calculateReduction(reportData.scope2Emissions.currentYear, reportData.scope2Emissions.previousYear)) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculateReduction(reportData.scope2Emissions.currentYear, reportData.scope2Emissions.previousYear)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">목표 달성률:</span>
                    <span className="font-bold text-blue-600">
                      {calculateTargetAchievement(reportData.scope2Emissions.currentYear, reportData.scope2Emissions.target)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Scope 3 */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="text-lg font-medium mb-3 text-green-700 flex items-center">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">3</span>
                  Scope 3
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">전년도:</span>
                    <span className="font-medium">{reportData.scope3Emissions.previousYear || 0}톤</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">금년도:</span>
                    <span className="font-medium">{reportData.scope3Emissions.currentYear || 0}톤</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">감소율:</span>
                    <span className={`font-bold ${parseFloat(calculateReduction(reportData.scope3Emissions.currentYear, reportData.scope3Emissions.previousYear)) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculateReduction(reportData.scope3Emissions.currentYear, reportData.scope3Emissions.previousYear)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">목표 달성률:</span>
                    <span className="font-bold text-blue-600">
                      {calculateTargetAchievement(reportData.scope3Emissions.currentYear, reportData.scope3Emissions.target)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 에너지 사용량 섹션 */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-yellow-700 flex items-center">
              <span className="mr-2">⚡</span>
              에너지 사용량 성과
            </h3>
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-700">{reportData.energyUsage.totalUsage || 0}</div>
                  <div className="text-sm text-gray-600">총 사용량 (MWh)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{reportData.energyUsage.renewableUsage || 0}</div>
                  <div className="text-sm text-gray-600">재생에너지 (MWh)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {calculatePercentage(reportData.energyUsage.renewableUsage, reportData.energyUsage.totalUsage)}%
                  </div>
                  <div className="text-sm text-gray-600">재생에너지 비중</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-600">재생에너지 목표 달성률: </span>
                <span className="font-bold text-blue-600">
                  {calculateTargetAchievement(reportData.energyUsage.renewableUsage, reportData.energyUsage.renewableTarget)}%
                </span>
              </div>
            </div>
          </section>

          {/* 폐기물 관리 섹션 */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-orange-700 flex items-center">
              <span className="mr-2">🗂️</span>
              폐기물 관리 성과
            </h3>
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-700">{reportData.wasteManagement.totalWaste || 0}</div>
                  <div className="text-sm text-gray-600">총 배출량 (톤)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{reportData.wasteManagement.recycledWaste || 0}</div>
                  <div className="text-sm text-gray-600">재활용량 (톤)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {calculatePercentage(reportData.wasteManagement.recycledWaste, reportData.wasteManagement.totalWaste)}%
                  </div>
                  <div className="text-sm text-gray-600">재활용률</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-600">재활용 목표 달성률: </span>
                <span className="font-bold text-blue-600">
                  {calculateTargetAchievement(reportData.wasteManagement.recycledWaste, reportData.wasteManagement.recyclingTarget)}%
                </span>
              </div>
            </div>
          </section>

          {/* 물 사용량 섹션 */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-blue-700 flex items-center">
              <span className="mr-2">💧</span>
              물 사용량 성과
            </h3>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-700">{reportData.waterUsage.previousYear || 0}</div>
                  <div className="text-sm text-gray-600">전년도 (m³)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">{reportData.waterUsage.currentYear || 0}</div>
                  <div className="text-sm text-gray-600">금년도 (m³)</div>
                </div>
                <div>
                  <div className={`text-2xl font-bold ${parseFloat(calculateReduction(reportData.waterUsage.currentYear, reportData.waterUsage.previousYear)) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {calculateReduction(reportData.waterUsage.currentYear, reportData.waterUsage.previousYear)}%
                  </div>
                  <div className="text-sm text-gray-600">절감률</div>
                </div>
              </div>
            </div>
          </section>

          {/* 친환경 기술 섹션 */}
          {reportData.ecoFriendlyTech.name && (
            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
                <span className="mr-2">🌱</span>
                친환경 기술 도입
              </h3>
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">기술명</div>
                    <div className="font-medium text-green-800">{reportData.ecoFriendlyTech.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">도입일</div>
                    <div className="font-medium text-green-800">
                      {reportData.ecoFriendlyTech.implementationDate ? 
                        new Date(reportData.ecoFriendlyTech.implementationDate).toLocaleDateString() : 
                        '미설정'
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">예상 효과</div>
                    <div className="font-medium text-green-800">{reportData.ecoFriendlyTech.expectedImpact}</div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div>
          {/* 종합 성과 평가 */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">🎯 종합 성과 평가</h3>
            <div className={`p-8 rounded-lg border-2 ${overallGrade.bgColor} border-opacity-50`}>
              <div className="text-center">
                <div className={`text-6xl font-bold mb-4 ${overallGrade.color}`}>
                  {overallGrade.grade}
                </div>
                <div className="text-2xl font-semibold text-gray-700 mb-2">
                  종합 점수: {overallScore}점
                </div>
                <div className="text-gray-600">
                  전반적인 ESG 목표 달성률이 우수합니다.
                </div>
              </div>
            </div>
          </section>

          {/* 개별 지표 분석 */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">📊 개별 지표 분석</h3>
            <div className="space-y-4">
              {[
                { 
                  name: 'Scope 1 배출량 목표 달성', 
                  score: calculateTargetAchievement(reportData.scope1Emissions.currentYear, reportData.scope1Emissions.target),
                  category: 'scope1'
                },
                { 
                  name: 'Scope 2 배출량 목표 달성', 
                  score: calculateTargetAchievement(reportData.scope2Emissions.currentYear, reportData.scope2Emissions.target),
                  category: 'scope2'
                },
                { 
                  name: 'Scope 3 배출량 목표 달성', 
                  score: calculateTargetAchievement(reportData.scope3Emissions.currentYear, reportData.scope3Emissions.target),
                  category: 'scope3'
                },
                { 
                  name: '재생에너지 목표 달성', 
                  score: calculateTargetAchievement(reportData.energyUsage.renewableUsage, reportData.energyUsage.renewableTarget),
                  category: 'energy'
                },
                { 
                  name: '폐기물 재활용 목표 달성', 
                  score: calculateTargetAchievement(reportData.wasteManagement.recycledWaste, reportData.wasteManagement.recyclingTarget),
                  category: 'waste'
                }
              ].filter(item => item.score > 0).map((item, index) => {
                const grade = getPerformanceGrade(item.score);
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-600">달성률: {item.score}%</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(parseFloat(item.score), 100)}%` }}
                        ></div>
                      </div>
                      <div className={`px-3 py-1 rounded-full ${grade.bgColor}`}>
                        <span className={`text-sm font-bold ${grade.color}`}>
                          {grade.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 개선 제안 */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">💡 개선 제안</h3>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  재생에너지 비중을 더 높여 Scope 2 배출량을 추가로 감축할 수 있습니다.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  폐기물 재활용률 향상을 통해 순환경제 모델을 강화하세요.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  물 사용량 절감 기술 도입으로 수자원 효율성을 높일 수 있습니다.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  친환경 기술 투자를 확대하여 장기적인 ESG 성과를 개선하세요.
                </li>
              </ul>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ReportPreview; 