import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { supabase } from './supabaseClient';
import { regions } from './constants/regions';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ChartComponent } from './components/ChartComponent';

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [prevalenceData, setPrevalenceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData] = useState({
    options: {
      chart: {
        id: 'prevalence-trend',
        toolbar: { show: false },
        fontFamily: 'inherit'
      },
      xaxis: {
        categories: Array.from({ length: 7 }, (_, i) => `قبل ${i + 1} أيام`)
      },
      colors: ['#3B82F6']
    },
    series: [{
      name: 'الحالات',
      data: [30, 40, 35, 50, 49, 60, 70]
    }]
  });

  const fetchData = async (region) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPrevalenceData({
        current: Math.floor(Math.random() * 100) + 1,
        trend: 'زيادة'
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRegion) {
      fetchData(selectedRegion.value);
    }
  }, [selectedRegion]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="max-w-md mx-auto mb-8">
            <Select
              options={regions}
              onChange={setSelectedRegion}
              placeholder="اختر المنطقة..."
              isSearchable
              isClearable
              className="text-right"
              styles={{
                control: (base) => ({
                  ...base,
                  border: '2px solid #3B82F6',
                  borderRadius: '8px',
                  padding: '4px'
                })
              }}
            />
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          )}

          {prevalenceData && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">الإحصائيات الحالية</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white p-4 rounded-lg">
                    <span className="text-gray-600">المعدل الحالي:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {prevalenceData.current}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-4 rounded-lg">
                    <span className="text-gray-600">الاتجاه:</span>
                    <span className={`text-xl font-semibold ${prevalenceData.trend === 'زيادة' ? 'text-red-600' : 'text-green-600'}`}>
                      {prevalenceData.trend}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">التطور الزمني</h2>
                <ChartComponent
                  options={chartData.options}
                  series={chartData.series}
                />
              </div>
            </div>
          )}

          {!selectedRegion && !loading && (
            <div className="text-center py-12 text-gray-500">
              <p>الرجاء اختيار منطقة لعرض البيانات</p>
            </div>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}