// src/components/calculators/ComparisonChart.jsx

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Cell 
} from 'recharts';
import { useRegion } from '../../context/RegionContext';

const ComparisonChart = ({ results, countryCurrency }) => {
  const { formatCurrency: contextFormatCurrency } = useRegion();
  const formatCurrency = typeof contextFormatCurrency === 'function' 
    ? contextFormatCurrency 
    : (value, currency, options = {}) => {
        const C = currency || '$';
        const num = Number(value || 0);
        if (options.notation === 'compact') {
            if (Math.abs(num) >= 1_000_000) return `${C}${(num / 1_000_000).toFixed(1)}M`;
            if (Math.abs(num) >= 1_000) return `${C}${(num / 1_000).toFixed(0)}K`; // No decimal for K for cleaner look
            return `${C}${num.toFixed(0)}`;
        }
        return `${C}${num.toFixed(options.forceDecimals !== undefined ? options.forceDecimals : 2)}`;
      };


  if (!results || !results.offers || results.offers.length === 0) {
    return (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Add at least two offers with salary information to see comparison charts.
        </div>
    );
  }
  if (results.offers.length === 1 && results.offers[0]?.salary === '') {
    return (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Enter salary for your offer to see charts. Add another offer for comparison.
        </div>
    );
  }


  const { compensationData, radarDataForChart, overallScoreData, radarLegendPayload } = useMemo(() => {
    const offers = results.offers;
    const bestOfferId = results.bestOfferId;

    const compData = offers.map(offer => ({
      name: offer.name || 'Unnamed Offer',
      netIncomeValue: offer.calculated?.netIncomeAnnual || 0,
      retirementValue: offer.calculated?.retirementBenefitAnnual || 0,
      totalCompensationValueForTooltip: offer.calculated?.grossAnnualCompensation || 0, // For tooltip
      id: offer.id,
      isBest: offer.id === bestOfferId,
    }));

    // Data structure for RadarChart:
    // Each object in the array is a "subject" (axis on the radar).
    // Each offer becomes a key within these subject objects.
    const radarSubjects = [
        { name: 'Financial', key: 'financial' }, // Corresponds to scores.financial
        { name: 'Work-Life', key: 'workLife' },   // Corresponds to scores.workLife
        { name: 'Benefits', key: 'benefits' },    // Corresponds to scores.benefits
    ];
    
    const radarData = radarSubjects.map(subject => {
        const entry = { subject: subject.name, fullMark: 100 }; // 'subject' is the axis label
        offers.forEach(offer => {
            entry[offer.name || `Offer ${offer.id}`] = offer.calculated?.scores?.[subject.key] || 0;
        });
        return entry;
    });
    
    const scoreData = offers.map(offer => ({
      name: offer.name || 'Unnamed Offer',
      score: offer.calculated?.scores?.overall || 0,
      id: offer.id,
      isBest: offer.id === bestOfferId,
    }));
    
    // Create payload for custom radar legend
    const legendPayload = offers.map((offer, index) => ({
        value: offer.name || `Offer ${offer.id}`,
        type: 'line', // or 'square', 'circle' etc.
        id: offer.id,
        color: offer.id === results.bestOfferId ? '#16a34a' : `hsl(${180 + index * 50}, 65%, 55%)` // Distinct colors
    }));


    return { 
        compensationData: compData, 
        radarDataForChart: radarData, 
        overallScoreData: scoreData,
        radarLegendPayload: legendPayload
    };
  }, [results]);

  const commonBarColor = "dark:fill-primary-600 fill-primary-500"; 
  const bestOfferBarColor = "dark:fill-green-500 fill-green-600";
  
  const cardBaseClass = "bg-white dark:bg-neutral-800 shadow-xl rounded-lg p-4 sm:p-6";

  const BarCustomTooltip = ({ active, payload, label }) => { /* ... (same as before, ensure formatCurrency is used correctly) ... */
    if (active && payload && payload.length) { const offerName = label; const offerData = compensationData.find(d => d.name === offerName); return (<div className="bg-white dark:bg-neutral-700 p-3 border border-gray-200 dark:border-neutral-600 rounded-lg shadow-lg text-gray-900 dark:text-white text-xs sm:text-sm"><p className="font-semibold mb-1 text-base">{offerName}</p>{payload.map(entry => (<p key={entry.dataKey} style={{ color: entry.payload.isBest && entry.dataKey === 'netIncomeValue' ? bestOfferBarColor : entry.fill }} className="capitalize">{entry.name}: {formatCurrency(entry.value, countryCurrency)}</p>))}<div className="border-t border-gray-200 dark:border-neutral-600 mt-2 pt-2"><p className="font-semibold">Total Gross Comp: {formatCurrency(offerData?.totalCompensationValueForTooltip || 0, countryCurrency)}</p></div></div>); } return null;
  };
  
  const RadarCustomTooltip = ({ active, payload }) => { /* ... (same as before) ... */
    if (active && payload && payload.length) { const subject = payload[0].payload.subject; return (<div className="bg-white dark:bg-neutral-700 p-3 border border-gray-200 dark:border-neutral-600 rounded-lg shadow-lg text-gray-900 dark:text-white text-xs sm:text-sm"><p className="font-semibold mb-1 text-base">{subject}</p>{payload.map((entry) => (<p key={entry.name} style={{ color: entry.color }}>{entry.name}: {Number(entry.value).toFixed(1)}</p>))}</div>); } return null;
  };

  const ScoreCustomTooltip = ({ active, payload, label }) => { /* ... (same as before) ... */
    if (active && payload && payload.length) { return (<div className="bg-white dark:bg-neutral-700 p-3 border border-gray-200 dark:border-neutral-600 rounded-lg shadow-lg text-gray-900 dark:text-white text-xs sm:text-sm"><p className="font-semibold">{label}</p><p style={{ color: payload[0].payload.isBest ? bestOfferBarColor : commonBarColor  }}>Score: {Number(payload[0].value).toFixed(1)}{payload[0].payload.isBest && <span className="ml-2 font-bold">(Best)</span>}</p></div>); } return null;
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className={cardBaseClass}>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">Compensation Structure</h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">Estimated Net Income and Retirement Benefits.</p>
        <div className="h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compensationData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis type="number" tickFormatter={(value) => formatCurrency(value, countryCurrency, { notation: 'compact' })} stroke="#9ca3af" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, width: 100 }} stroke="#9ca3af" interval={0} />
              <Tooltip content={<BarCustomTooltip />} cursor={{ fill: 'rgba(209, 213, 219, 0.1)' }} />
              <Legend wrapperStyle={{fontSize: "11px", paddingTop: '10px'}}/>
              <Bar dataKey="netIncomeValue" stackId="comp" name="Net Income (Est.)" radius={[4,0,0,4]}>
                {compensationData.map((entry) => (<Cell key={`cell-${entry.id}-net`} className={entry.isBest ? bestOfferBarColor : commonBarColor} />))}
              </Bar>
              <Bar dataKey="retirementValue" stackId="comp" name="Retirement Benefit (Est.)" radius={[0,4,4,0]}>
                 {compensationData.map((entry) => (<Cell key={`cell-${entry.id}-ret`} className={entry.isBest ? 'fill-emerald-400 dark:fill-emerald-500' : 'fill-sky-400 dark:fill-sky-500'} />))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className={cardBaseClass}>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">Multi-Factor Radar View</h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">Comparing scores for Financial, Work-Life, and Benefits (0-100 scale).</p>
        <div className="h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarDataForChart}>
              <PolarGrid strokeOpacity={0.3} className="dark:stroke-neutral-600"/>
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#6b7280' }} className="dark:fill-neutral-400" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tickCount={6} tick={{ fontSize: 9, fill: '#6b7280' }} className="dark:fill-neutral-400"/>
              <Tooltip content={<RadarCustomTooltip />} />
              <Legend payload={radarLegendPayload} wrapperStyle={{fontSize: "11px", marginTop: "10px"}}/>
              {results.offers.map((offer, index) => (
                <Radar
                  key={offer.id}
                  name={offer.name || `Offer ${offer.id}`}
                  dataKey={offer.name || `Offer ${offer.id}`} // Key in radarDataForChart objects
                  stroke={radarLegendPayload.find(p => p.id === offer.id)?.color || '#8884d8'}
                  fill={radarLegendPayload.find(p => p.id === offer.id)?.color || '#8884d8'}
                  fillOpacity={offer.id === results.bestOfferId ? 0.65 : 0.45} 
                  dot={{ r: 3, strokeWidth: 1.5 }}
                  activeDot={{ r: 5, strokeWidth: 2 }}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className={cardBaseClass}>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">Overall Score Comparison</h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">Weighted score based on financial, work-life, and benefits factors.</p>
        <div className="h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overallScoreData} margin={{ top: 5, right: 20, left: -15, bottom: 30 }}> {/* Increased bottom margin for angled labels */}
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} className="dark:fill-neutral-400" interval={0} angle={results.offers.length > 3 ? -30 : 0} textAnchor={results.offers.length > 3 ? "end" : "middle"} height={results.offers.length > 3 ? 60 : 30}/>
              <YAxis domain={[0, 100]} tickCount={6} tick={{ fontSize: 10, fill: '#6b7280' }} className="dark:fill-neutral-400"/>
              <Tooltip content={<ScoreCustomTooltip />} cursor={{ fill: 'rgba(209, 213, 219, 0.1)' }} />
              <Bar dataKey="score" name="Overall Score" radius={[4, 4, 0, 0]}>
                {overallScoreData.map((entry) => (
                  <Cell key={`cell-score-${entry.id}`} className={entry.isBest ? bestOfferBarColor : commonBarColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default ComparisonChart;