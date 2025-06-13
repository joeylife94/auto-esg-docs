import React, { useState, useEffect } from 'react';

const InputForm = ({ onSubmit, onPreviewUpdate, isLoading }) => {
  const [formData, setFormData] = useState({
    // AI 생성을 위한 기본 정보
    companyName: '',
    year: new Date().getFullYear(),
    category: 'greenhouse',
    subCategory: 'scope1', // 새로 추가: 세부 카테고리
    customPrompt: '',
    
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

  const [errors, setErrors] = useState({});
  const [validationMessages, setValidationMessages] = useState({});

  // ESG 카테고리별 세부 옵션
  const categoryOptions = {
    greenhouse: {
      label: '온실가스 배출량',
      subOptions: [
        { value: 'scope1', label: 'Scope 1 (직접 배출)' },
        { value: 'scope2', label: 'Scope 2 (간접 배출 - 전력)' },
        { value: 'scope3', label: 'Scope 3 (기타 간접 배출)' },
        { value: 'all_scopes', label: '전체 Scope 통합' }
      ]
    },
    energy: {
      label: '에너지 사용량',
      subOptions: [
        { value: 'total_usage', label: '총 에너지 사용량' },
        { value: 'renewable', label: '재생에너지 사용' },
        { value: 'efficiency', label: '에너지 효율성' }
      ]
    },
    waste: {
      label: '폐기물 배출',
      subOptions: [
        { value: 'total_waste', label: '총 폐기물 배출량' },
        { value: 'recycling', label: '재활용 및 재사용' },
        { value: 'hazardous', label: '유해 폐기물 관리' }
      ]
    },
    water: {
      label: '물 사용량',
      subOptions: [
        { value: 'consumption', label: '물 소비량' },
        { value: 'recycling', label: '물 재활용' },
        { value: 'quality', label: '수질 관리' }
      ]
    }
  };

  // 문체 톤 옵션
  const toneOptions = [
    { 
      value: 'formal', 
      label: '공식적', 
      description: '전문적이고 격식있는 문체로 작성' 
    },
    { 
      value: 'concise', 
      label: '간결', 
      description: '핵심만 간단명료하게 작성' 
    },
    { 
      value: 'analytical', 
      label: '분석적', 
      description: '데이터와 통계 중심으로 작성' 
    }
  ];

  // 실시간 입력 검증
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const newMessages = { ...validationMessages };

    // 숫자 필드 검증
    if (name.includes('previousYear') || name.includes('currentYear') || 
        name.includes('target') || name.includes('Usage') || name.includes('Waste')) {
      const numValue = parseFloat(value);
      if (value && (isNaN(numValue) || numValue < 0)) {
        newErrors[name] = true;
        newMessages[name] = '0 이상의 숫자를 입력해주세요';
      } else {
        delete newErrors[name];
        delete newMessages[name];
      }
    }

    // 회사명 검증
    if (name === 'companyName') {
      if (value && value.length < 2) {
        newErrors[name] = true;
        newMessages[name] = '회사명은 2글자 이상 입력해주세요';
      } else {
        delete newErrors[name];
        delete newMessages[name];
      }
    }

    // 연도 검증
    if (name === 'year') {
      const yearValue = parseInt(value);
      if (value && (yearValue < 2020 || yearValue > 2030)) {
        newErrors[name] = true;
        newMessages[name] = '2020년부터 2030년 사이의 연도를 입력해주세요';
      } else {
        delete newErrors[name];
        delete newMessages[name];
      }
    }

    setErrors(newErrors);
    setValidationMessages(newMessages);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 실시간 검증
    validateField(name, value);
    
    if (name.includes('.')) {
      // 중첩된 객체 필드 처리
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      // 일반 필드 처리
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // 카테고리 변경 시 세부 카테고리 초기화
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        subCategory: categoryOptions[value]?.subOptions[0]?.value || ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('🚀 폼 제출 시작');
    console.log('📋 현재 폼 데이터:', formData);
    console.log('⚠️ 현재 에러들:', errors);
    
    // 제출 전 전체 검증
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      console.log('❌ 에러로 인한 제출 취소:', Object.keys(errors));
      alert(`입력값을 확인해주세요.\n오류 필드: ${Object.keys(errors).join(', ')}`);
      return;
    }
    
    // 필수 필드 확인
    if (!formData.companyName || !formData.year || !formData.category || !formData.tone) {
      console.log('❌ 필수 필드 누락');
      console.log('- 회사명:', formData.companyName);
      console.log('- 연도:', formData.year); 
      console.log('- 카테고리:', formData.category);
      console.log('- 문체:', formData.tone);
      alert('필수 필드를 모두 입력해주세요.');
      return;
    }
    
    console.log('✅ 검증 통과, onSubmit 호출');
    onSubmit(formData);
  };

  // 동적으로 미리보기 업데이트 (실시간)
  useEffect(() => {
    if (formData.companyName && Object.keys(errors).length === 0) {
      // 유효한 데이터가 있을 때만 미리보기 업데이트
      onPreviewUpdate && onPreviewUpdate(formData, true); // true는 미리보기 모드
    }
  }, [formData, onPreviewUpdate, errors]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 ESG 보고서 데이터 입력</h2>
      
      <form onSubmit={handleSubmit}>
        {/* 기본 정보 섹션 */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">🏢 기본 정보</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                회사명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
                placeholder="예: 그린테크코리아"
              />
              {validationMessages.companyName && (
                <p className="mt-1 text-sm text-red-600">{validationMessages.companyName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                보고 연도 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.year ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
                min="2020"
                max="2030"
              />
              {validationMessages.year && (
                <p className="mt-1 text-sm text-red-600">{validationMessages.year}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                중점 ESG 카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                {Object.entries(categoryOptions).map(([key, option]) => (
                  <option key={key} value={key}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                세부 항목 <span className="text-red-500">*</span>
              </label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                {categoryOptions[formData.category]?.subOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 문체 선택 섹션 - 라디오 버튼으로 개선 */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
          <h3 className="text-xl font-semibold mb-4 text-green-800">✍️ 문체 선택</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {toneOptions.map(option => (
              <div key={option.value} className="relative">
                <input
                  type="radio"
                  name="tone"
                  value={option.value}
                  checked={formData.tone === option.value}
                  onChange={handleChange}
                  className="sr-only"
                  id={`tone-${option.value}`}
                />
                <label
                  htmlFor={`tone-${option.value}`}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.tone === option.value
                      ? 'border-green-500 bg-green-100 text-green-800'
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="font-semibold text-lg mb-1">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 추가 지시사항 섹션 - 개선된 UI */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
          <h3 className="text-xl font-semibold mb-4 text-purple-800">💡 추가 지시사항</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              특별히 강조하고 싶은 ESG 목표나 성과를 입력해주세요
            </label>
            <textarea
              name="customPrompt"
              value={formData.customPrompt}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="예: 2024년 탄소중립 달성 목표, 신재생에너지 70% 전환 계획, 플라스틱 제로 이니셔티브 등 특별히 부각하고 싶은 내용을 자세히 적어주세요."
            />
            <div className="mt-2 text-xs text-gray-500">
              💡 구체적인 목표, 혁신적인 기술, 사회적 영향 등을 언급하면 더 전문적인 보고서가 생성됩니다.
            </div>
          </div>
        </div>

        {/* 데이터 입력 섹션들 */}
        {/* 온실가스 배출량 섹션 */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">🏭 온실가스 배출량 (톤 CO2e)</h3>
          
          {/* Scope 1 */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-3 text-gray-600 flex items-center">
              <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">1</span>
              Scope 1 (직접 배출)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">전년도</label>
                <div className="relative">
                  <input
                    type="number"
                    name="scope1Emissions.previousYear"
                    value={formData.scope1Emissions.previousYear}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['scope1Emissions.previousYear'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-400">톤</span>
                </div>
                {validationMessages['scope1Emissions.previousYear'] && (
                  <p className="mt-1 text-xs text-red-600">{validationMessages['scope1Emissions.previousYear']}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">금년도</label>
                <div className="relative">
                  <input
                    type="number"
                    name="scope1Emissions.currentYear"
                    value={formData.scope1Emissions.currentYear}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['scope1Emissions.currentYear'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-400">톤</span>
                </div>
                {validationMessages['scope1Emissions.currentYear'] && (
                  <p className="mt-1 text-xs text-red-600">{validationMessages['scope1Emissions.currentYear']}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">목표</label>
                <div className="relative">
                  <input
                    type="number"
                    name="scope1Emissions.target"
                    value={formData.scope1Emissions.target}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['scope1Emissions.target'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-400">톤</span>
                </div>
                {validationMessages['scope1Emissions.target'] && (
                  <p className="mt-1 text-xs text-red-600">{validationMessages['scope1Emissions.target']}</p>
                )}
              </div>
            </div>
          </div>

          {/* Scope 2 */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-3 text-gray-600 flex items-center">
              <span className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">2</span>
              Scope 2 (간접 배출)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">전년도</label>
                <div className="relative">
                  <input
                    type="number"
                    name="scope2Emissions.previousYear"
                    value={formData.scope2Emissions.previousYear}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['scope2Emissions.previousYear'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-400">톤</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">금년도</label>
                <div className="relative">
                  <input
                    type="number"
                    name="scope2Emissions.currentYear"
                    value={formData.scope2Emissions.currentYear}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['scope2Emissions.currentYear'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-400">톤</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">목표</label>
                <div className="relative">
                  <input
                    type="number"
                    name="scope2Emissions.target"
                    value={formData.scope2Emissions.target}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['scope2Emissions.target'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-400">톤</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scope 3 */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-3 text-gray-600 flex items-center">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">3</span>
              Scope 3 (기타 간접 배출)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">전년도</label>
                <div className="relative">
                  <input
                    type="number"
                    name="scope3Emissions.previousYear"
                    value={formData.scope3Emissions.previousYear}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['scope3Emissions.previousYear'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-400">톤</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">금년도</label>
                <div className="relative">
                  <input
                    type="number"
                    name="scope3Emissions.currentYear"
                    value={formData.scope3Emissions.currentYear}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['scope3Emissions.currentYear'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-400">톤</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">목표</label>
                <div className="relative">
                  <input
                    type="number"
                    name="scope3Emissions.target"
                    value={formData.scope3Emissions.target}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors['scope3Emissions.target'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-400">톤</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 에너지 사용량 섹션 */}
        <div className="mb-8 p-6 bg-yellow-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-yellow-700">⚡ 에너지 사용량 (MWh)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">총 사용량</label>
              <div className="relative">
                <input
                  type="number"
                  name="energyUsage.totalUsage"
                  value={formData.energyUsage.totalUsage}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors['energyUsage.totalUsage'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-2 text-sm text-gray-400">MWh</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">재생에너지 사용량</label>
              <div className="relative">
                <input
                  type="number"
                  name="energyUsage.renewableUsage"
                  value={formData.energyUsage.renewableUsage}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors['energyUsage.renewableUsage'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-2 text-sm text-gray-400">MWh</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">재생에너지 목표</label>
              <div className="relative">
                <input
                  type="number"
                  name="energyUsage.renewableTarget"
                  value={formData.energyUsage.renewableTarget}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors['energyUsage.renewableTarget'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-2 text-sm text-gray-400">MWh</span>
              </div>
            </div>
          </div>
        </div>

        {/* 폐기물 관리 섹션 */}
        <div className="mb-8 p-6 bg-orange-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-orange-700">🗂️ 폐기물 관리 (톤)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">총 배출량</label>
              <div className="relative">
                <input
                  type="number"
                  name="wasteManagement.totalWaste"
                  value={formData.wasteManagement.totalWaste}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors['wasteManagement.totalWaste'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-2 text-sm text-gray-400">톤</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">재활용량</label>
              <div className="relative">
                <input
                  type="number"
                  name="wasteManagement.recycledWaste"
                  value={formData.wasteManagement.recycledWaste}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors['wasteManagement.recycledWaste'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-2 text-sm text-gray-400">톤</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">재활용 목표</label>
              <div className="relative">
                <input
                  type="number"
                  name="wasteManagement.recyclingTarget"
                  value={formData.wasteManagement.recyclingTarget}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors['wasteManagement.recyclingTarget'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-2 text-sm text-gray-400">톤</span>
              </div>
            </div>
          </div>
        </div>

        {/* 물 사용량 섹션 */}
        <div className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">💧 물 사용량 (m³)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">전년도</label>
              <div className="relative">
                <input
                  type="number"
                  name="waterUsage.previousYear"
                  value={formData.waterUsage.previousYear}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors['waterUsage.previousYear'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-2 text-sm text-gray-400">m³</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">금년도</label>
              <div className="relative">
                <input
                  type="number"
                  name="waterUsage.currentYear"
                  value={formData.waterUsage.currentYear}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors['waterUsage.currentYear'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-2 text-sm text-gray-400">m³</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">절감 목표</label>
              <div className="relative">
                <input
                  type="number"
                  name="waterUsage.reductionTarget"
                  value={formData.waterUsage.reductionTarget}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors['waterUsage.reductionTarget'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-2 text-sm text-gray-400">m³</span>
              </div>
            </div>
          </div>
        </div>

        {/* 친환경 기술 섹션 */}
        <div className="mb-8 p-6 bg-green-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-green-700">🌱 친환경 기술</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">기술명</label>
              <input
                type="text"
                name="ecoFriendlyTech.name"
                value={formData.ecoFriendlyTech.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 태양광 발전 시설"
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
                placeholder="예: 연간 CO2 100톤 감축"
              />
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              console.log('🔥 버튼 클릭됨!');
              handleSubmit(new Event('submit'));
            }}
            disabled={isLoading}
            className={`px-8 py-3 font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 ${
              isLoading 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                AI 보고서 생성 중...
              </div>
            ) : (
              <div className="flex items-center">
                <span className="mr-2">🚀</span>
                보고서 생성
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm; 