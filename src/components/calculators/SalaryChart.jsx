import React from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useRegion } from '../../context/RegionContext';

const SalaryChart = ({ results }) => {
  const { formatCurrency } = useRegion();

  if (!results) return null;

  const pieData = [
    { name: 'Net Pay', value: results.net.annual, color: '#22c55e' },
    {
      name: 'Federal Tax',
      value: results.taxes.federalTax || 0,
      color: '#ef4444',
    },
    {
      name: 'State/Provincial Tax',
      value: results.taxes.stateTax || 0,
      color: '#f97316',
    },
    {
      name: 'Social Security',
      value: results.taxes.socialSecurity || 0,
      color: '#8b5cf6',
    },
    {
      name: 'Medicare/Health',
      value: results.taxes.medicare || 0,
      color: '#06b6d4',
    },
    {
      name: 'Other Deductions',
      value: (results.taxes.other || 0) + results.deductions.voluntary,
      color: '#6b7280',
    },
  ].filter((item) => item.value > 0);

  const barData = [
    { period: 'Hourly', gross: results.gross.hourly, net: results.net.hourly },
    { period: 'Daily', gross: results.gross.daily, net: results.net.daily },
    { period: 'Weekly', gross: results.gross.weekly, net: results.net.weekly },
    {
      period: 'Monthly',
      gross: results.gross.monthly,
      net: results.net.monthly,
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.payload.color }} className="text-sm">
            {formatCurrency(data.value)}
          </p>
          <p className="text-xs text-gray-500">
            {((data.value / results.gross.annual) * 100).toFixed(1)}% of gross
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart - Salary Breakdown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Annual Salary Breakdown
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {pieData.map((item, index) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600 truncate">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bar Chart - Pay Periods */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="calculator-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Gross vs Net by Period
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis
                tickFormatter={(value) =>
                  formatCurrency(value).replace(/\.\d+/, '')
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="gross"
                fill="#94a3b8"
                name="Gross"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="net"
                fill="#22c55e"
                name="Net"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="text-xs text-gray-600">Gross Pay</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-xs text-gray-600">Net Pay</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SalaryChart;
