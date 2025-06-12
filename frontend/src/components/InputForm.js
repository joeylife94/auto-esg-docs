import React, { useState } from 'react';

const InputForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    category: '',
    companyName: '',
    year: new Date().getFullYear(),
    tone: 'formal', // formal, concise, analytical
    customPrompt: '',
  });

  const categories = [
    { value: 'greenhouse', label: '온실가스 배출량' },
    { value: 'energy', label: '에너지 사용량' },
    { value: 'waste', label: '폐기물 관리' },
    { value: 'water', label: '물 사용량' },
    { value: 'biodiversity', label: '생물다양성' },
  ];

  const tones = [
    { value: 'formal', label: '공식적' },
    { value: 'concise', label: '간결' },
    { value: 'analytical', label: '분석적' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">ESG 보고서 생성</h3>
        <div className="mt-5">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  회사명
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  ESG 카테고리
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  >
                    <option value="">선택하세요</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  보고 연도
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="year"
                    id="year"
                    required
                    min="2000"
                    max="2100"
                    value={formData.year}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                  문체 톤
                </label>
                <div className="mt-1">
                  <div className="flex items-center space-x-4">
                    {tones.map((tone) => (
                      <div key={tone.value} className="flex items-center">
                        <input
                          id={`tone-${tone.value}`}
                          name="tone"
                          type="radio"
                          value={tone.value}
                          checked={formData.tone === tone.value}
                          onChange={handleChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label
                          htmlFor={`tone-${tone.value}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {tone.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-700">
                  추가 지시사항 (선택사항)
                </label>
                <div className="mt-1">
                  <textarea
                    id="customPrompt"
                    name="customPrompt"
                    rows={3}
                    value={formData.customPrompt}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="특별한 요구사항이 있으면 입력하세요"
                  />
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setFormData({
                    category: '',
                    companyName: '',
                    year: new Date().getFullYear(),
                    tone: 'formal',
                    customPrompt: '',
                  })}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  초기화
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {isLoading ? '생성 중...' : '보고서 생성'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InputForm; 