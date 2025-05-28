import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRegion } from '../../context/RegionContext'; // Assuming this path is correct

const SavingsChart = ({ results, countryCurrency }) => {
  const { formatCurrency: contextFormatCurrency } = useRegion();
  const formatCurrency = contextFormatCurrency;

  if (!results || !results.monthlyData || results.monthlyData.length === 0) return null;

  // Filter for yearly data points, ensuring month 0 (initial) is included
  const yearlyData = results.monthlyData.filter((entry) => entry.month === 0 || entry.month % 12 === 0);
  // If last month isn't a multiple of 12, add it to show final point
  if (results.monthlyData.length > 1 && (results.monthlyData.length -1) % 12 !== 0) {
      const lastEntry = results.monthlyData[results.monthlyData.length -1];
      if (!yearlyData.find(d => d.month === lastEntry.month)) {
        yearlyData.push({...lastEntry, year: Math.ceil(lastEntry.month / 12) }); // Ensure year is correct
      }
  }
  // Sort by month to ensure order
  yearlyData.sort((a,b) => a.month - b.month);


  const pieData = [
    { name: 'Total Contributions', value: results.summary?.totalPrincipalContributions || 0, color: '#3b82f6' }, // Blue
    { name: 'Total Interest', value: results.summary?.totalInterestEarned || 0, color: '#22c55e' } // Green
  ].filter(item => typeof item.value === 'number' && item.value > 0);

  const CustomTooltip = ({ active, payload, label }) => { // label here is 'year'
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-neutral-700 p-3 border border-gray-200 dark:border-neutral-600 rounded-lg shadow-lg text-gray-900 dark:text-white">
          <p className="font-medium mb-1">Year {payload[0].payload.year}</p> {/* Use year from payload */}
          {payload.map((entry, index) => (
            <div key={index} className="text-sm">
              <span style={{ color: entry.stroke }}>● {entry.name}: </span>
              <span>{formatCurrency(entry.value, countryCurrency)}</span>
            </div>
          ))}
           <div className="text-sm mt-1 pt-1 border-t dark:border-neutral-600">
              <span className="font-semibold">Total Balance: </span>
              <span>{formatCurrency(payload.reduce((sum, p) => sum + p.value, 0), countryCurrency)}</span>
            </div>
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
          {results.summary?.totalFutureValue > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {((data.value / results.summary.totalFutureValue) * 100).toFixed(1)}% of total
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-neutral-700 pb-2">Savings Growth Over Time</h3>
        {yearlyData.length > 1 ? (
        <>
            <div className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}> {/* Adjusted margins */}
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="#9ca3af"/>
                <YAxis tickFormatter={(value) => formatCurrency(value, countryCurrency, { notation: 'compact', maximumSignificantDigits: 2 })} tick={{ fontSize: 11 }} stroke="#9ca3af"/>
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="contributions" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.7} name="Total Contributions" />
                <Area type="monotone" dataKey="interest" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.7} name="Total Interest" />
                {/* <Legend verticalAlign="top" height={36}/> */}
                </AreaChart>
            </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-3 text-xs">
                <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#3b82f6' }}/>
                    <span className="text-gray-600 dark:text-gray-400">Total Contributions</span>
                </div>
                <div className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#22c55e' }}/>
                    <span className="text-gray-600 dark:text-gray-400">Total Interest</span>
                </div>
            </div>
        </>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 h-64 md:h-72 flex items-center justify-center">Not enough data for growth chart.</p>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className={cardBaseClass}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-neutral-700 pb-2">Investment Mix (at End)</h3>
        {pieData.length > 0 ? (
        <>
            <div className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius="45%" outerRadius="80%" dataKey="value" /* label */ >
                    {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                {/* <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" /> */}
                </PieChart>
            </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-xs">
                {pieData.map((item) => (
                    <div key={item.name} className="flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}/>
                    <span className="text-gray-600 dark:text-gray-400 truncate">{item.name}</span>
                    </div>
                ))}
            </div>
        </>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 h-64 md:h-72 flex items-center justify-center">No data for investment mix chart.</p>
        )}
      </motion.div>
    </div>
  );
};

export default SavingsChart;