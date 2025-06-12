import React from 'react';
import { PDFDownloadLink, Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';

// PDF 스타일 정의
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: 'grey',
  },
});

// PDF 문서 컴포넌트
const ReportDocument = ({ reportData }) => {
  const getCategoryLabel = (category) => {
    const categories = {
      greenhouse: '온실가스 배출량',
      energy: '에너지 사용량',
      waste: '폐기물 관리',
      water: '물 사용량',
      biodiversity: '생물다양성',
    };
    return categories[category] || category;
  };

  // 실제로는 Gemini API 응답을 사용하지만, 여기서는 카테고리별 샘플 텍스트 제공
  const getSampleContent = (category, companyName, year, tone) => {
    const toneStyle = {
      formal: '공식적이고 전문적인',
      concise: '간결하고 명확한',
      analytical: '분석적이고 데이터 중심의',
    };
    
    const contents = {
      greenhouse: `${companyName}은(는) ${year}년 온실가스 배출량 관리에 있어 ${toneStyle[tone]} 접근 방식을 채택했습니다. 
      탄소 중립을 향한 여정에서 당사는 직접 배출(Scope 1) 및 간접 배출(Scope 2)을 모두 측정하고 관리하고 있습니다. 
      전년 대비 온실가스 배출량은 12% 감소했으며, 이는 재생 에너지 사용 증가와 에너지 효율성 향상 프로젝트의 결과입니다.`,
      
      energy: `${companyName}의 ${year}년 에너지 사용량 보고서는 ${toneStyle[tone]} 내용을 담고 있습니다. 
      당사는 총 에너지 소비량의 35%를 재생 가능 에너지원으로 전환했으며, 
      에너지 효율성 향상을 위한 시설 업그레이드를 통해 전체 에너지 소비를 전년 대비 8% 절감했습니다.`,
      
      waste: `${companyName}은(는) ${year}년 폐기물 관리에 있어 ${toneStyle[tone]} 전략을 구현했습니다. 
      매립 폐기물을 25% 감소시켰으며, 재활용률은 65%로 향상되었습니다. 
      제로 웨이스트 이니셔티브를 통해 생산 공정에서 발생하는 폐기물의 재사용 및 업사이클링을 촉진하고 있습니다.`,
      
      water: `${companyName}의 ${year}년 물 사용량 관리는 ${toneStyle[tone]} 접근법을 보여줍니다. 
      물 사용량을 전년 대비 15% 절감했으며, 폐수 재활용 시스템을 도입하여 생산 공정에서 사용되는 물의 40%를 재사용하고 있습니다. 
      또한 지역 수자원 보호 프로젝트에 참여하여 지역사회와의 상생을 도모하고 있습니다.`,
      
      biodiversity: `${companyName}은(는) ${year}년 생물다양성 보존을 위해 ${toneStyle[tone]} 프로그램을 운영했습니다. 
      사업장 주변 자연 서식지 복원 프로젝트를 통해 지역 생태계를 지원하고, 
      공급망 전반에 걸쳐 생물다양성 영향 평가를 실시하여 부정적 영향을 최소화하기 위한 조치를 취하고 있습니다.`,
    };
    
    return contents[category] || `${companyName}의 ${year}년 ESG 보고서입니다. ${toneStyle[tone]} 내용이 여기에 표시됩니다.`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{reportData.companyName} ESG 보고서</Text>
          <Text style={styles.subtitle}>{getCategoryLabel(reportData.category)} ({reportData.year})</Text>
          <Text style={styles.text}>
            {getSampleContent(reportData.category, reportData.companyName, reportData.year, reportData.tone)}
          </Text>
          {reportData.customPrompt && (
            <>
              <Text style={styles.subtitle}>추가 정보</Text>
              <Text style={styles.text}>{reportData.customPrompt}</Text>
            </>
          )}
        </View>
        <Text style={styles.footer}>
          이 보고서는 Auto ESG Docs를 통해 자동 생성되었습니다. © {new Date().getFullYear()}
        </Text>
      </Page>
    </Document>
  );
};

const ReportPreview = ({ reportData, isLoading }) => {
  // 카테고리 레이블 가져오기
  const getCategoryLabel = (category) => {
    const categories = {
      greenhouse: '온실가스 배출량',
      energy: '에너지 사용량',
      waste: '폐기물 관리',
      water: '물 사용량',
      biodiversity: '생물다양성',
    };
    return categories[category] || category;
  };

  // 샘플 콘텐츠 가져오기 (실제로는 Gemini API 응답 사용)
  const getSampleContent = (category, companyName, year, tone) => {
    const toneStyle = {
      formal: '공식적이고 전문적인',
      concise: '간결하고 명확한',
      analytical: '분석적이고 데이터 중심의',
    };
    
    const contents = {
      greenhouse: `${companyName}은(는) ${year}년 온실가스 배출량 관리에 있어 ${toneStyle[tone]} 접근 방식을 채택했습니다. 
      탄소 중립을 향한 여정에서 당사는 직접 배출(Scope 1) 및 간접 배출(Scope 2)을 모두 측정하고 관리하고 있습니다. 
      전년 대비 온실가스 배출량은 12% 감소했으며, 이는 재생 에너지 사용 증가와 에너지 효율성 향상 프로젝트의 결과입니다.`,
      
      energy: `${companyName}의 ${year}년 에너지 사용량 보고서는 ${toneStyle[tone]} 내용을 담고 있습니다. 
      당사는 총 에너지 소비량의 35%를 재생 가능 에너지원으로 전환했으며, 
      에너지 효율성 향상을 위한 시설 업그레이드를 통해 전체 에너지 소비를 전년 대비 8% 절감했습니다.`,
      
      waste: `${companyName}은(는) ${year}년 폐기물 관리에 있어 ${toneStyle[tone]} 전략을 구현했습니다. 
      매립 폐기물을 25% 감소시켰으며, 재활용률은 65%로 향상되었습니다. 
      제로 웨이스트 이니셔티브를 통해 생산 공정에서 발생하는 폐기물의 재사용 및 업사이클링을 촉진하고 있습니다.`,
      
      water: `${companyName}의 ${year}년 물 사용량 관리는 ${toneStyle[tone]} 접근법을 보여줍니다. 
      물 사용량을 전년 대비 15% 절감했으며, 폐수 재활용 시스템을 도입하여 생산 공정에서 사용되는 물의 40%를 재사용하고 있습니다. 
      또한 지역 수자원 보호 프로젝트에 참여하여 지역사회와의 상생을 도모하고 있습니다.`,
      
      biodiversity: `${companyName}은(는) ${year}년 생물다양성 보존을 위해 ${toneStyle[tone]} 프로그램을 운영했습니다. 
      사업장 주변 자연 서식지 복원 프로젝트를 통해 지역 생태계를 지원하고, 
      공급망 전반에 걸쳐 생물다양성 영향 평가를 실시하여 부정적 영향을 최소화하기 위한 조치를 취하고 있습니다.`,
    };
    
    return contents[category] || `${companyName}의 ${year}년 ESG 보고서입니다. ${toneStyle[tone]} 내용이 여기에 표시됩니다.`;
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow sm:rounded-lg h-full">
        <div className="px-4 py-5 sm:p-6 flex flex-col items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-gray-600">보고서 생성 중...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="bg-white shadow sm:rounded-lg h-full">
        <div className="px-4 py-5 sm:p-6 flex flex-col items-center justify-center h-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-4 text-gray-600">양식을 작성하고 '보고서 생성' 버튼을 클릭하세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">보고서 미리보기</h3>
        <div className="mt-5 prose prose-indigo">
          <h2>{reportData.companyName} ESG 보고서</h2>
          <h3>{getCategoryLabel(reportData.category)} ({reportData.year})</h3>
          <p className="whitespace-pre-line">
            {getSampleContent(reportData.category, reportData.companyName, reportData.year, reportData.tone)}
          </p>
          {reportData.customPrompt && (
            <>
              <h3>추가 정보</h3>
              <p>{reportData.customPrompt}</p>
            </>
          )}
        </div>
        <div className="mt-6">
          <PDFDownloadLink
            document={<ReportDocument reportData={reportData} />}
            fileName={`${reportData.companyName}-ESG-Report-${reportData.year}.pdf`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {({ blob, url, loading, error }) =>
              loading ? '준비 중...' : 'PDF 다운로드'
            }
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview; 