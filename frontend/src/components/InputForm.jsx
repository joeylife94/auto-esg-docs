import React, { useState } from 'react';

const InputForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    // 온실가스 배출량 (Scope 1, 2, 3)
    scope1Emissions: {
      previousYear: '',
      currentYear: '',
      target: ''
    },
    scope2Emissions: {
      previousYear: '',
      currentYear: '',
      target: ''
    },
    scope3Emissions: {
      previousYear: '',
      currentYear: '',
      target: ''
    },
    
    // 에너지 사용량
    energyUsage: {
      totalUsage: '',
      renewableUsage: '',
      renewableTarget: ''
    },
    
    // 폐기물
    wasteManagement: {
      totalWaste: '',
      recycledWaste: '',
      recyclingTarget: ''
    },
    
    // 물 사용량
    waterUsage: {
      previousYear: '',
      currentYear: '',
      reductionTarget: ''
    },
    
    // 친환경 기술
    ecoFriendlyTech: {
      name: '',
      implementationDate: '',
      expectedImpact: ''
    },
    
    // 문체 선택
    tone: 'formal'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">ESG 보고서 데이터 입력</h2>
      
      {/* 온실가스 배출량 섹션 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">온실가스 배출량 (톤 CO2e)</h3>
        
        {/* Scope 1 */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3 text-gray-600">Scope 1 (직접 배출)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">전년도</label>
              <input
                type="number"
                name="scope1Emissions.previousYear"
                value={formData.scope1Emissions.previousYear}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">금년도</label>
              <input
                type="number"
                name="scope1Emissions.currentYear"
                value={formData.scope1Emissions.currentYear}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">목표</label>
              <input
                type="number"
                name="scope1Emissions.target"
                value={formData.scope1Emissions.target}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Scope 2 */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3 text-gray-600">Scope 2 (간접 배출)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">전년도</label>
              <input
                type="number"
                name="scope2Emissions.previousYear"
                value={formData.scope2Emissions.previousYear}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">금년도</label>
              <input
                type="number"
                name="scope2Emissions.currentYear"
                value={formData.scope2Emissions.currentYear}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">목표</label>
              <input
                type="number"
                name="scope2Emissions.target"
                value={formData.scope2Emissions.target}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Scope 3 */}
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3 text-gray-600">Scope 3 (기타 간접 배출)</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">전년도</label>
              <input
                type="number"
                name="scope3Emissions.previousYear"
                value={formData.scope3Emissions.previousYear}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">금년도</label>
              <input
                type="number"
                name="scope3Emissions.currentYear"
                value={formData.scope3Emissions.currentYear}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">목표</label>
              <input
                type="number"
                name="scope3Emissions.target"
                value={formData.scope3Emissions.target}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* 에너지 사용량 섹션 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">에너지 사용량 (MWh)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">총 사용량</label>
            <input
              type="number"
              name="energyUsage.totalUsage"
              value={formData.energyUsage.totalUsage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">재생에너지 사용량</label>
            <input
              type="number"
              name="energyUsage.renewableUsage"
              value={formData.energyUsage.renewableUsage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">재생에너지 목표</label>
            <input
              type="number"
              name="energyUsage.renewableTarget"
              value={formData.energyUsage.renewableTarget}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* 폐기물 섹션 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">폐기물 관리 (톤)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">총 배출량</label>
            <input
              type="number"
              name="wasteManagement.totalWaste"
              value={formData.wasteManagement.totalWaste}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">재활용량</label>
            <input
              type="number"
              name="wasteManagement.recycledWaste"
              value={formData.wasteManagement.recycledWaste}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">재활용 목표</label>
            <input
              type="number"
              name="wasteManagement.recyclingTarget"
              value={formData.wasteManagement.recyclingTarget}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* 물 사용량 섹션 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">물 사용량 (m³)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">전년도</label>
            <input
              type="number"
              name="waterUsage.previousYear"
              value={formData.waterUsage.previousYear}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">금년도</label>
            <input
              type="number"
              name="waterUsage.currentYear"
              value={formData.waterUsage.currentYear}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">절감 목표</label>
            <input
              type="number"
              name="waterUsage.reductionTarget"
              value={formData.waterUsage.reductionTarget}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* 친환경 기술 섹션 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">친환경 기술</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">기술명</label>
            <input
              type="text"
              name="ecoFriendlyTech.name"
              value={formData.ecoFriendlyTech.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">도입일</label>
            <input
              type="date"
              name="ecoFriendlyTech.implementationDate"
              value={formData.ecoFriendlyTech.implementationDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">예상 효과</label>
            <input
              type="text"
              name="ecoFriendlyTech.expectedImpact"
              value={formData.ecoFriendlyTech.expectedImpact}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* 문체 선택 섹션 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">문체 선택</h3>
        <div>
          <select
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="formal">공식적</option>
            <option value="concise">간결</option>
            <option value="analytical">분석적</option>
          </select>
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          보고서 생성
        </button>
      </div>
    </form>
  );
};

export default InputForm; 