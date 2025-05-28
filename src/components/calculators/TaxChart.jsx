import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRegion } from '../../context/RegionContext'; // Assuming this path is correct

const TaxChart = ({ results, countryCurrency }) => { // Added countryCurrency prop
  const { formatCurrency: contextFormatCurrency } = useRegion();
  const formatCurrency = contextFormatCurrency;

  if (!results) return null;

  // Defensive access
  const grossIncome = results.income?.gross || 0;
  const netIncome = results.income?.net || 0;
  const federalTax = results.taxes?.federalTax || 0;
  const stateTax = results.taxes?.stateTax || 0;
  const socialSecurity = results.taxes?.socialSecurity || 0;
  const medicare = results.taxes?.medicare || 0;
  const otherTaxes = results.taxes?.other || 0;
  const taxableIncome = results.income?.taxable || 0;
  const totalTaxVal = results.taxes?.totalTax || 0;

  const pieData = [
    { name: 'Net Income', value: netIncome, color: '#22c55e' }, // Green
    { name: 'Federal Tax', value: federalTax, color: '#ef4444' }, // Red
    { name: 'State/Prov. Tax', value: stateTax, color: '#f97316' }, // Orange
    { name: 'Social Security', value: socialSecurity, color: '#8b5cf6' }, // Purple
    { name: 'Medicare/Health', value: medicare, color: '#3b82f6' }, // Blue
    { name: 'Other Taxes', value: otherTaxes, color: '#6b7280' } // Gray
  ].filter(item => typeof item.value === 'number' && item.value > 0);

  const comparisonData = [
    { category: 'Gross Inc.', amount: grossIncome, fill: '#10b981' }, // Emerald
    { category: 'Taxable Inc.', amount: taxableIncome, fill: '#f59e0b' }, // Amber
    { category: 'Total Taxes', amount: totalTaxVal, fill: '#ef4444' },   // Red
    { category: 'Net Inc.', amount: netIncome, fill: '#22c55e' }    // Green
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-700 p-3 border border-gray-200 dark:border-neutral-600 rounded-lg shadow-lg text-gray-900 dark:text-white">
          <p className="font-medium">{payload[0].payload.category || label}</p> {/* Use category from payload if available */}
          <p className="text-sm" style={{ color: payload[0].payload.fill || payload[0].color }}>
            {formatCurrency(payload[0].value, countryCurrency)}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-neutral-700 p-3 border border-gray-200 dark:border-neutral-600 rounded-lg shadow-lg text-gray-900 dark:text-white">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.payload.color }} className="text-sm">
            {formatCurrency(data.value, countryCurrency)}
          </p>
          {grossIncome > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {((data.value / grossIncome) * 100).toFixed(1)}% of gross
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const cardBaseClass = "bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-6";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.0 }} className={cardBaseClass}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-neutral-700 pb-2">Income Distribution</h3>
        {pieData.length > 0 ? (
        <>
            <div className="h-64 md:h-72"> {/* Increased height slightly */}
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius="45%" outerRadius="80%" dataKey="value" labelLine={false} 
                    // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} // Optional: direct labels
                >
                    {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} /> ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                {/* <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" /> */}
                </PieChart>
            </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-4 text-xs">
            {pieData.map((item) => (
                <div key={item.name} className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}/>
                <span className="text-gray-600 dark:text-gray-400 truncate">{item.name}</span>
                </div>
            ))}
            </div>
        </>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 h-64 md:h-72 flex items-center justify-center">Not enough data for pie chart.</p>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className={cardBaseClass}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-neutral-700 pb-2">Income vs. Taxes Comparison</h3>
        {comparisonData.some(d => d.amount > 0) ? (
        <div className="h-64 md:h-72 mt-6"> {/* Added mt-6 for better spacing with title */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis type="number" tickFormatter={(value) => formatCurrency(value, countryCurrency, { notation: 'compact', maximumSignificantDigits: 2})} stroke="#9ca3af" /> {/* Gray axis */}
              <YAxis type="category" dataKey="category" width={85} tick={{ fontSize: 11 }} stroke="#9ca3af" /> {/* Gray axis */}
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(209, 213, 219, 0.3)' }} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 h-64 md:h-72 flex items-center justify-center">Not enough data for bar chart.</p>
        )}
      </motion.div>
    </div>
  );
};

export default TaxChart;