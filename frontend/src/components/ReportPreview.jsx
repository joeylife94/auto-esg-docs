import React from 'react';

const ReportPreview = ({ reportData }) => {
  if (!reportData) return null;

  const calculateReduction = (current, previous) => {
    if (!current || !previous) return 0;
    return ((previous - current) / previous * 100).toFixed(1);
  };

  const calculateTargetAchievement = (current, target) => {
    if (!current || !target) return 0;
    return ((current / target) * 100).toFixed(1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">ESG 보고서 미리보기</h2>

      {/* 온실가스 배출량 섹션 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">온실가스 배출량</h3>
        
        {/* Scope 1 */}
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2 text-gray-600">Scope 1 (직접 배출)</h4>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700">
              전년도 대비 {calculateReduction(reportData.scope1Emissions.currentYear, reportData.scope1Emissions.previousYear)}% 감소한 {reportData.scope1Emissions.currentYear}톤 CO2e를 기록했습니다.
              목표 대비 달성률은 {calculateTargetAchievement(reportData.scope1Emissions.currentYear, reportData.scope1Emissions.target)}%입니다.
            </p>
          </div>
        </div>

        {/* Scope 2 */}
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2 text-gray-600">Scope 2 (간접 배출)</h4>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700">
              전년도 대비 {calculateReduction(reportData.scope2Emissions.currentYear, reportData.scope2Emissions.previousYear)}% 감소한 {reportData.scope2Emissions.currentYear}톤 CO2e를 기록했습니다.
              목표 대비 달성률은 {calculateTargetAchievement(reportData.scope2Emissions.currentYear, reportData.scope2Emissions.target)}%입니다.
            </p>
          </div>
        </div>

        {/* Scope 3 */}
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2 text-gray-600">Scope 3 (기타 간접 배출)</h4>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-gray-700">
              전년도 대비 {calculateReduction(reportData.scope3Emissions.currentYear, reportData.scope3Emissions.previousYear)}% 감소한 {reportData.scope3Emissions.currentYear}톤 CO2e를 기록했습니다.
              목표 대비 달성률은 {calculateTargetAchievement(reportData.scope3Emissions.currentYear, reportData.scope3Emissions.target)}%입니다.
            </p>
          </div>
        </div>
      </section>

      {/* 에너지 사용량 섹션 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">에너지 사용량</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700">
            총 에너지 사용량은 {reportData.energyUsage.totalUsage}MWh이며, 
            이 중 재생에너지 비중은 {((reportData.energyUsage.renewableUsage / reportData.energyUsage.totalUsage) * 100).toFixed(1)}%입니다.
            재생에너지 목표 달성률은 {calculateTargetAchievement(reportData.energyUsage.renewableUsage, reportData.energyUsage.renewableTarget)}%입니다.
          </p>
        </div>
      </section>

      {/* 폐기물 관리 섹션 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">폐기물 관리</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700">
            총 폐기물 배출량은 {reportData.wasteManagement.totalWaste}톤이며,
            재활용률은 {((reportData.wasteManagement.recycledWaste / reportData.wasteManagement.totalWaste) * 100).toFixed(1)}%입니다.
            재활용 목표 달성률은 {calculateTargetAchievement(reportData.wasteManagement.recycledWaste, reportData.wasteManagement.recyclingTarget)}%입니다.
          </p>
        </div>
      </section>

      {/* 물 사용량 섹션 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">물 사용량</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700">
            전년도 대비 {calculateReduction(reportData.waterUsage.currentYear, reportData.waterUsage.previousYear)}% 감소한 {reportData.waterUsage.currentYear}m³를 사용했습니다.
            물 사용량 절감 목표 달성률은 {calculateTargetAchievement(reportData.waterUsage.currentYear, reportData.waterUsage.reductionTarget)}%입니다.
          </p>
        </div>
      </section>

      {/* 친환경 기술 섹션 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">친환경 기술 도입</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700">
            {reportData.ecoFriendlyTech.name} 기술을 {new Date(reportData.ecoFriendlyTech.implementationDate).toLocaleDateString()}에 도입했습니다.
            예상 효과: {reportData.ecoFriendlyTech.expectedImpact}
          </p>
        </div>
      </section>

      {/* 종합 평가 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">종합 평가</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-gray-700">
            전반적인 ESG 목표 달성률은 평균 {(
              (calculateTargetAchievement(reportData.scope1Emissions.currentYear, reportData.scope1Emissions.target) +
               calculateTargetAchievement(reportData.scope2Emissions.currentYear, reportData.scope2Emissions.target) +
               calculateTargetAchievement(reportData.scope3Emissions.currentYear, reportData.scope3Emissions.target) +
               calculateTargetAchievement(reportData.energyUsage.renewableUsage, reportData.energyUsage.renewableTarget) +
               calculateTargetAchievement(reportData.wasteManagement.recycledWaste, reportData.wasteManagement.recyclingTarget) +
               calculateTargetAchievement(reportData.waterUsage.currentYear, reportData.waterUsage.reductionTarget)) / 6
            ).toFixed(1)}%입니다.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ReportPreview; 