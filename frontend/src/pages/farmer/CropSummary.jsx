import React, { useState, useEffect } from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import api from '../../api/axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CropSummary = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get('/crops/summary');
      setSummary(res.data.summary);
    } catch (error) {
      console.error('Failed to load crop summary');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  // Chart configuration
  const generateColors = (count) => {
    const colors = [];
    for(let i=0; i<count; i++) {
      colors.push(`hsl(${(i * 360) / count}, 70%, 50%)`);
    }
    return colors;
  };

  const chartData = {
    labels: summary.map(item => item.crop_name),
    datasets: [
      {
        data: summary.map(item => item.total_area),
        backgroundColor: generateColors(summary.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-primary-100 text-primary-600 rounded-2xl mb-4">
          <PieChartIcon size={32} />
        </div>
        <h1 className="text-3xl font-display font-bold text-dark-900 mb-2">Regional Crop Summary</h1>
        <p className="text-dark-500">A macro view of what's being cultivated across the entire KrishiSetu ecosystem.</p>
      </div>

      {summary.length === 0 ? (
        <div className="card p-12 text-center text-dark-500">No crop data available yet.</div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          
          <div className="card p-6 flex flex-col justify-center items-center relative min-h-[400px]">
            <h3 className="font-bold text-lg mb-6 self-start">Cultivation Distribution</h3>
            <div className="w-[80%] max-w-[350px]">
              <Pie 
                data={chartData} 
                options={{
                  plugins: {
                    legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true } }
                  }
                }} 
              />
            </div>
          </div>

          <div className="card overflow-hidden flex flex-col">
            <div className="p-6 border-b border-earth-100 bg-earth-50/50">
              <h3 className="font-bold text-lg">Aggregate Statistics</h3>
            </div>
            <div className="overflow-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white sticky top-0 border-b border-earth-200 shadow-sm z-10">
                  <tr className="text-sm font-semibold text-dark-600 uppercase tracking-wider">
                    <th className="p-4 text-left">Crop</th>
                    <th className="p-4 text-center">Farms Growing</th>
                    <th className="p-4 text-right">Total Area (Acres)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-earth-100">
                  {summary.map((item, idx) => (
                    <tr key={idx} className="hover:bg-earth-50">
                      <td className="p-4 font-bold text-dark-900">{item.crop_name}</td>
                      <td className="p-4 text-center">
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold">
                          {item.farmers_count}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium text-dark-800">
                        {item.total_area.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-earth-100 font-bold text-dark-900">
                    <td className="p-4">Total</td>
                    <td className="p-4 text-center">{summary.reduce((acc, curr) => acc + curr.farmers_count, 0)}</td>
                    <td className="p-4 text-right">{summary.reduce((acc, curr) => acc + curr.total_area, 0).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default CropSummary;
