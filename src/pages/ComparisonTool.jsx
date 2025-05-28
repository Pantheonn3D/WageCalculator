// src/pages/ComparisonTool.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Scale, Download, Share2, Info, Plus, Trash2, Check, Award, Bookmark,
    DollarSign, Clock, Receipt, PiggyBank as SavingsIcon, ChevronRight, Layers,
    Zap // Using Layers for 'Add another offer' CTA, Zap for 'Explore tools'
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { useRegion } from '../context/RegionContext';
import { calculateTax } from '../utils/taxCalculations'; 
import ComparisonChart from '../components/calculators/ComparisonChart';

const DEBOUNCE_DELAY_MS = 700;
const MAX_OFFERS = 5; 

const createNewOffer = (id) => ({
  id, name: `Offer ${id}`, salary: '', bonus: '0', retirementMatchPercent: '3', 
  healthInsuranceMonthlyCost: '300', paidVacationDays: '15', 
  commuteTimeOneWayMinutes: '30', remoteDaysPerWeek: '0',
});

const relatedTools = [
    { title: 'Salary Calculator', href: '/salary-calculator', icon: DollarSign, description: "Understand your gross vs. net pay." },
    { title: 'Tax Calculator', href: '/tax-calculator', icon: Receipt, description: "Estimate your income tax burden." },
    { title: 'Savings Goal Planner', href: '/savings-calculator', icon: SavingsIcon, description: "Plan how to reach your financial goals." },
];

const ComparisonTool = () => {
  const { selectedCountry, countries, formatCurrency } = useRegion();
  
  const initialOffers = [createNewOffer(1)];
  initialOffers[0].name = 'My Offer / Current Role';

  const [offers, setOffers] = useState(initialOffers);
  const [nextId, setNextId] = useState(initialOffers.length + 1);
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [filingStatus, setFilingStatus] = useState('single'); 

  const performCalculation = useCallback(() => {
    if (offers.length === 0 || !selectedCountry || !countries || !countries[selectedCountry]) {
      setResults(null); setIsCalculating(false); return;
    }
    const hasSalaryInput = offers.some(o => o.salary && !isNaN(parseFloat(o.salary)));
    if (!hasSalaryInput && offers.length > 0) {
        setResults(null); setIsCalculating(false); return;
    }
    if(hasSalaryInput) setIsCalculating(true);

    try {
      const calculatedOffers = offers.map(offer => {
        const salary = parseFloat(offer.salary) || 0;
        const bonus = parseFloat(offer.bonus) || 0;
        const retirementMatchPercentValue = (parseFloat(offer.retirementMatchPercent) || 0) / 100;
        const healthInsuranceMonthlyCostValue = parseFloat(offer.healthInsuranceMonthlyCost) || 0;
        const paidVacationDaysValue = parseFloat(offer.paidVacationDays) || 0;
        const commuteTimeOneWayMinutesValue = parseFloat(offer.commuteTimeOneWayMinutes) || 0;
        const remoteDaysPerWeekValue = parseFloat(offer.remoteDaysPerWeek) || 0;

        const retirementBenefitAnnual = salary * retirementMatchPercentValue;
        const grossAnnualCompensation = salary + bonus + retirementBenefitAnnual;
        
        const taxParams = { filingStatus };
        const taxInfo = (salary + bonus > 0) ? calculateTax(salary + bonus, selectedCountry, taxParams) : { totalTax: 0, taxableIncome: salary + bonus /* Or a more sophisticated default */ }; 
        const totalTaxAnnual = taxInfo.totalTax || 0;
        const netIncomeAnnual = salary + bonus - totalTaxAnnual;
        const netTotalCompensationAnnual = grossAnnualCompensation - totalTaxAnnual;

        const typicalWorkDaysInYear = 260; 
        const actualWorkDaysAfterVacation = Math.max(0, typicalWorkDaysInYear - paidVacationDaysValue);
        
        const officeDaysPerWeek = 5 - remoteDaysPerWeekValue;
        const annualCommuteDays = officeDaysPerWeek > 0 ? actualWorkDaysAfterVacation * (officeDaysPerWeek / 5) : 0;
        const annualCommuteHours = (commuteTimeOneWayMinutesValue * 2 * annualCommuteDays) / 60;

        const annualWorkHoursBase = actualWorkDaysAfterVacation * 8; 
        const effectiveAnnualWorkHoursWithCommute = annualWorkHoursBase + annualCommuteHours;

        const effectiveHourlyRateNet = annualWorkHoursBase > 0 ? netIncomeAnnual / annualWorkHoursBase : 0;
        const effectiveHourlyRateNetWithCommute = effectiveAnnualWorkHoursWithCommute > 0 ? netIncomeAnnual / effectiveAnnualWorkHoursWithCommute : 0;
        const effectiveHourlyCompensationNet = effectiveAnnualWorkHoursWithCommute > 0 ? netTotalCompensationAnnual / effectiveAnnualWorkHoursWithCommute : 0;

        let workLifeScore = 50;
        workLifeScore += Math.max(-20, Math.min(20, (paidVacationDaysValue - 15) * 2.5)); 
        workLifeScore += Math.max(-20, Math.min(20, (30 - commuteTimeOneWayMinutesValue) * 0.67)); 
        workLifeScore += Math.min(20, remoteDaysPerWeekValue * 4); 
        workLifeScore = Math.max(0, Math.min(100, workLifeScore));

        let benefitsScore = 50;
        benefitsScore += Math.max(-25, Math.min(25, (retirementMatchPercentValue * 100 - 3) * 8)); 
        benefitsScore += Math.max(-25, Math.min(25, (300 - healthInsuranceMonthlyCostValue) * 0.15)); 
        benefitsScore = Math.max(0, Math.min(100, benefitsScore));
        
        const financialScaleFactor = 150000; 
        const financialScore = Math.min(100, Math.max(0, (netTotalCompensationAnnual / financialScaleFactor) * 100));

        const overallScore = (financialScore * 0.5) + (workLifeScore * 0.3) + (benefitsScore * 0.2);
        
        return {
          ...offer, 
          calculated: {
            grossAnnualCompensation, netIncomeAnnual, netTotalCompensationAnnual, retirementBenefitAnnual,
            annualInsuranceCost: healthInsuranceMonthlyCostValue * 12, totalTaxAnnual, actualWorkDaysAfterVacation,
            annualCommuteHours, effectiveHourlyRateNet, effectiveHourlyRateNetWithCommute, effectiveHourlyCompensationNet,
            scores: { workLife: workLifeScore, benefits: benefitsScore, financial: financialScore, overall: overallScore },
            taxableIncomeReported: taxInfo.taxableIncome 
          },
        };
      });
      
      const bestOffer = offers.length > 1 
        ? [...calculatedOffers].sort((a, b) => b.calculated.scores.overall - a.calculated.scores.overall)[0]
        : calculatedOffers[0]; 
      
      setResults({
        offers: calculatedOffers, bestOfferId: bestOffer?.id, 
        comparisonDate: new Date().toISOString(),
        weights: { financial: 0.5, workLife: 0.3, benefits: 0.2 } 
      });
    } catch (error) { console.error('Comparison calculation error:', error); setResults(null); } finally { setIsCalculating(false); }
  }, [offers, selectedCountry, countries, filingStatus, calculateTax]); 

  useEffect(() => {
    if (offers.some(o => o.salary && !isNaN(parseFloat(o.salary)))) {
        const timer = setTimeout(performCalculation, DEBOUNCE_DELAY_MS);
        return () => clearTimeout(timer);
    } else if (results !== null) { setResults(null); }
  }, [offers, performCalculation, results]);

  const handleOfferChange = (id, field, value) => setOffers(prevOffers => prevOffers.map(offer => offer.id === id ? { ...offer, [field]: value } : offer ));
  const addNewOffer = () => { if (offers.length < MAX_OFFERS) { setOffers(prevOffers => [...prevOffers, createNewOffer(nextId)]); setNextId(prevId => prevId + 1); } else { alert(`You can compare a maximum of ${MAX_OFFERS} offers.`); } };
  const deleteOffer = (idToDelete) => { if (offers.length > 1) { setOffers(prevOffers => prevOffers.filter(offer => offer.id !== idToDelete)); } else { alert('Please keep at least one offer row. You can edit its details.'); } };
  const exportResults = () => { if (!results || !selectedCountry || !countries || !countries[selectedCountry]) return; const countryData = countries[selectedCountry]; const dataToExport = { calculationInput: { countryCode: selectedCountry, countryName: countryData.name, currency: countryData.currency, offers: offers.map(o => ({ name: o.name, salary: o.salary, bonus: o.bonus, retirementMatchPercent: o.retirementMatchPercent, healthInsuranceMonthlyCost: o.healthInsuranceMonthlyCost, paidVacationDays: o.paidVacationDays, commuteTimeOneWayMinutes: o.commuteTimeOneWayMinutes, remoteDaysPerWeek: o.remoteDaysPerWeek, })), filingStatus: filingStatus, }, calculationOutput: { comparedOffers: results.offers.map(o => ({ name: o.name, ...o.calculated })), bestOfferId: results.bestOfferId, comparisonDate: results.comparisonDate, scoreWeights: results.weights } }; const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `job-offer-comparison-${selectedCountry}-${new Date().toISOString().split('T')[0]}.json`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); };
  const shareResults = async () => { if (!results || !results.offers || results.offers.length === 0 || !selectedCountry || !countries || !countries[selectedCountry]) return; const countryData = countries[selectedCountry]; const bestCalculatedOffer = results.offers.find(o => o.id === results.bestOfferId); if (!bestCalculatedOffer) { alert("Could not determine the best offer to share."); return; } const shareText = `Job Offer Comparison for ${countryData.name}:\nRecommended: ${bestCalculatedOffer.name}\nEst. Total Comp: ${formatCurrency(bestCalculatedOffer.calculated.grossAnnualCompensation, countryData.currency)}\nEst. Net Income: ${formatCurrency(bestCalculatedOffer.calculated.netIncomeAnnual, countryData.currency)}`; const shareUrl = window.location.href; if (navigator.share) { try { await navigator.share({ title: `Job Offer Comparison - ${countryData.name}`, text: shareText, url: shareUrl }); } catch (error) { console.error('Share via API failed:', error); try { await navigator.clipboard.writeText(`${shareText}\n\nView details: ${shareUrl}`); alert('Results copied to clipboard! You can now paste it to share.'); } catch (clipboardError) { alert('Sharing failed. Please try exporting or manually copy the page link.'); } } } else { try { await navigator.clipboard.writeText(`${shareText}\n\nView details: ${shareUrl}`); alert('Results copied to clipboard! You can now paste it to share.'); } catch (clipboardError) { alert('Unable to copy to clipboard. Please manually copy the page link.'); } } };
  
  const currentCountryName = useMemo(() => (countries && selectedCountry && countries[selectedCountry]) ? countries[selectedCountry].name : 'your region', [countries, selectedCountry]);
  const currentCurrencySymbol = useMemo(() => (countries && selectedCountry && countries[selectedCountry]) ? countries[selectedCountry].currency : '$', [countries, selectedCountry]);
  const structuredData = useMemo(() => ({ "@context": "https://schema.org", "@type": "HowTo", "name": `Job Offer Comparison Tool - ${currentCountryName}`, "description": `Compare multiple job offers side-by-side. Analyze salary, bonus, benefits (retirement, health insurance), vacation, commute, remote work, and net income after taxes in ${currentCountryName} to make the best career decision. Use this comprehensive job offer evaluator for detailed financial and lifestyle insights.`, "step": [ {"@type": "HowToStep", "name": "Enter Offer Details", "text": "Input key financial and non-financial details for each job offer, such as salary, bonus, retirement match, insurance costs, vacation days, commute time, and remote work schedule."}, {"@type": "HowToStep", "name": "Add Multiple Offers", "text": "Use the 'Add Offer' button to include all opportunities you are considering, up to five offers."}, {"@type": "HowToStep", "name": "Review Comparison", "text": "The tool automatically calculates total compensation, net income after estimated taxes for your selected region, effective hourly rates, and provides scores for financial value, work-life balance, and benefits."}, {"@type": "HowToStep", "name": "Analyze Results", "text": "Use the detailed breakdown and charts to identify the best overall offer based on a weighted scoring system and your personal priorities."} ], "estimatedCost": { "@type": "MonetaryAmount", "currency": "USD", "value": "0" }, "supply": [ {"@type": "HowToSupply", "name": "Job offer letters or details"}, {"@type": "HowToSupply", "name": "Estimated commute times"} ], "tool": [ {"@type": "HowToTool", "name": "This online job offer comparison calculator"} ], "totalTime": "PT10M" }), [currentCountryName]);
  
  const inputFieldClass = "w-full p-2.5 border border-gray-300 dark:border-neutral-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-neutral-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-neutral-700/50 placeholder-gray-400 dark:placeholder-neutral-500";
  const thClass = "text-left py-3.5 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider sticky top-0 bg-gray-100 dark:bg-neutral-700/60 z-10 backdrop-blur-sm";
  const tdClass = "py-3 px-4 whitespace-nowrap"; // Increased padding
  const cardBaseClass = "bg-white dark:bg-neutral-800 shadow-xl rounded-xl p-6 sm:p-8"; // Enhanced card styling: more padding, rounded-xl
  const heroGradientClass = "bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800"; // Main blue gradient
  const standoutGradientClass = "bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700"; // Green gradient for "best"


  return (
    <>
      <SEOHead 
        title={`Job Offer Comparison Calculator & Analyzer - ${currentCountryName} | WageCalculator`}
        description={`Make the best career decision. Compare job offers by salary, net pay, benefits, work-life balance in ${currentCountryName} with our comprehensive analysis tool.`}
        keywords={`job offer comparison tool ${currentCountryName}, salary comparison ${currentCountryName}, benefits analyzer, net income calculator job offer, career decision tool, job offer evaluator ${currentCountryName}, compare compensation packages`}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 py-8 md:py-12">
        <section className="mb-10 md:mb-12 text-center px-4">
             <div className="inline-flex items-center justify-center p-4 bg-primary-100 dark:bg-primary-500/20 rounded-full mb-5 shadow-md">
                 <Scale className="w-10 h-10 text-primary-600 dark:text-primary-400" />
             </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Job Offer Comparison Tool</h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Analyze multiple job offers side-by-side for {currentCountryName}. Input details to compare compensation, net income, benefits, and work-life factors.
            </p>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12"> {/* Added space-y for overall vertical rhythm */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} >
            <div className={cardBaseClass}> {/* Input table card */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b dark:border-neutral-700 pb-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    <Layers className="w-7 h-7 inline-block mr-3 text-primary-500 dark:text-primary-400" />
                    Enter Offer Details
                </h2>
                <button onClick={addNewOffer} disabled={offers.length >= MAX_OFFERS} className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 dark:disabled:bg-neutral-600 transition-colors">
                  <Plus className="w-5 h-5 mr-2 -ml-1" /> Add Offer
                </button>
              </div>
              <div className="mb-6 max-w-md"> {/* max-w-md for filing status section */}
                <label htmlFor="filingStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax Filing Status (for all offers)</label>
                <select id="filingStatus" name="filingStatus" value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)} className={inputFieldClass}>
                    <option value="single">Single</option>
                    <option value="married_jointly">Married Filing Jointly</option>
                    {/* TODO: Add more statuses and ensure taxCalculations.js supports them */}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">This status is used for tax estimations. Ensure your tax data in `utils` supports the selected status.</p>
              </div>
              <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-md border dark:border-neutral-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-800"> 
                    <tr>
                      <th scope="col" className={`${thClass} rounded-tl-md`}>Job Name</th> 
                      <th scope="col" className={thClass}>Salary ({currentCurrencySymbol})</th> 
                      <th scope="col" className={thClass}>Bonus ({currentCurrencySymbol})</th> 
                      <th scope="col" className={thClass}>Retirement Match (%)</th> 
                      <th scope="col" className={thClass}>Health Ins. (Monthly {currentCurrencySymbol})</th> 
                      <th scope="col" className={thClass}>Vacation Days</th> 
                      <th scope="col" className={thClass}>Commute (min/way)</th> 
                      <th scope="col" className={thClass}>Remote Days/Week</th> 
                      <th scope="col" className={`${thClass} rounded-tr-md`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                    {offers.map((offer) => (<tr key={offer.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors"><td className={tdClass}><input type="text" value={offer.name} onChange={(e) => handleOfferChange(offer.id, 'name', e.target.value)} className={inputFieldClass} placeholder="e.g., Company A" /></td><td className={tdClass}><input type="number" value={offer.salary} onChange={(e) => handleOfferChange(offer.id, 'salary', e.target.value)} className={inputFieldClass} placeholder="75000" min="0" /></td><td className={tdClass}><input type="number" value={offer.bonus} onChange={(e) => handleOfferChange(offer.id, 'bonus', e.target.value)} className={inputFieldClass} placeholder="5000" min="0"/></td><td className={tdClass}><input type="number" value={offer.retirementMatchPercent} onChange={(e) => handleOfferChange(offer.id, 'retirementMatchPercent', e.target.value)} className={inputFieldClass} placeholder="3" step="0.1" min="0"/></td><td className={tdClass}><input type="number" value={offer.healthInsuranceMonthlyCost} onChange={(e) => handleOfferChange(offer.id, 'healthInsuranceMonthlyCost', e.target.value)} className={inputFieldClass} placeholder="300" min="0"/></td><td className={tdClass}><input type="number" value={offer.paidVacationDays} onChange={(e) => handleOfferChange(offer.id, 'paidVacationDays', e.target.value)} className={inputFieldClass} placeholder="15" min="0"/></td><td className={tdClass}><input type="number" value={offer.commuteTimeOneWayMinutes} onChange={(e) => handleOfferChange(offer.id, 'commuteTimeOneWayMinutes', e.target.value)} className={inputFieldClass} placeholder="30" min="0"/></td><td className={tdClass}><select value={offer.remoteDaysPerWeek} onChange={(e) => handleOfferChange(offer.id, 'remoteDaysPerWeek', e.target.value)} className={inputFieldClass}>{[0,1,2,3,4,5].map(d => <option key={d} value={d}>{d === 5 ? 'Full Remote' : `${d} day${d === 1 ? '' : 's'}`}</option>)}</select></td><td className={`${tdClass} text-center`}><button onClick={() => deleteOffer(offer.id)} disabled={offers.length <= 1} title="Delete Offer"className={`p-2 rounded-md transition-colors ${ offers.length <= 1 ? 'bg-gray-200 dark:bg-neutral-700 text-gray-400 dark:text-neutral-500 cursor-not-allowed' : 'text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700/50'}`}><Trash2 className="w-4 h-4 sm:w-5 sm:h-5" /></button></td></tr>))}
                  </tbody>
                </table>
              </div>
              {results && (<div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button onClick={exportResults} aria-label="Export comparison results as JSON" className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 dark:border-neutral-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"><Download className="w-5 h-5 mr-2 -ml-1" /> Export Results</button>
                <button onClick={shareResults} aria-label="Share comparison results" className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"><Share2 className="w-5 h-5 mr-2 -ml-1" /> Share Comparison</button>
              </div>)}
            </div>
          </motion.div>

          {isCalculating && !results ? ( <motion.div className={`${cardBaseClass} flex flex-col items-center justify-center text-center py-12`} style={{minHeight: '300px'}}><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div><p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Comparing offers...</p></motion.div>
          ) : results ? (
            <div className="space-y-8 md:space-y-12">
              {offers.length === 1 && results.offers.length === 1 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                    className={`${heroGradientClass} text-white shadow-2xl rounded-xl p-8 text-center relative overflow-hidden ring-4 ring-white/20 dark:ring-primary-500/30`}
                >
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-12 -right-8 w-40 h-40 bg-white/5 rounded-full opacity-50"></div>
                    <Layers className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-5 text-white/80 relative z-10" /> 
                    <h3 className="text-3xl lg:text-4xl font-bold mb-4 relative z-10">Ready for a Full Comparison?</h3>
                    <p className="text-primary-100 dark:text-blue-200 mb-8 max-w-xl mx-auto text-lg relative z-10">
                        You've analyzed one offer. Add another to unlock side-by-side details, charts, and our top recommendation!
                    </p>
                    <button onClick={addNewOffer} disabled={offers.length >= MAX_OFFERS}
                        className="bg-white text-primary-600 dark:text-primary-700 px-10 py-3.5 rounded-lg font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/80 disabled:opacity-70 disabled:cursor-not-allowed relative z-10"
                    > <Plus className="w-6 h-6 mr-2.5 inline-block -ml-1" /> Add Another Offer </button>
                </motion.div>
              )}

              {offers.length > 1 && results.bestOfferId && ( 
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                  className={`${standoutGradientClass} text-white shadow-2xl rounded-xl p-6 sm:p-8 ring-4 ring-green-300 dark:ring-emerald-500/70`}
                > 
                  <div className="flex flex-col md:flex-row items-center md:space-x-6 relative z-10">
                      <div className="mb-6 md:mb-0 bg-white/20 p-4 rounded-full shrink-0 backdrop-blur-sm ring-1 ring-white/30">
                          <Award className="w-10 h-10 md:w-12 md:h-12 text-white" />
                      </div>
                      <div className="text-center md:text-left">
                          <p className="text-sm uppercase tracking-wider text-green-200 dark:text-emerald-200 font-semibold mb-1">Top Recommendation</p>
                          <h3 className="text-3xl lg:text-4xl font-bold mb-2">
                            {results.offers.find(o => o.id === results.bestOfferId)?.name || 'N/A'}
                          </h3>
                          <p className="text-green-100 dark:text-emerald-100 mb-5 text-base max-w-2xl">
                              This offer stands out based on our comprehensive analysis of financial rewards, benefits, and work-life balance factors.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                          {(['Total Compensation', 'Net Income', 'Overall Score']).map(metric => {
                              const offer = results.offers.find(o => o.id === results.bestOfferId)?.calculated; let value;
                              if (offer) { if (metric === 'Total Compensation') value = formatCurrency(offer.grossAnnualCompensation, currentCurrencySymbol); else if (metric === 'Net Income') value = formatCurrency(offer.netTotalCompensationAnnual, currentCurrencySymbol); else if (metric === 'Overall Score') value = offer.scores.overall.toFixed(1); } else { value = 'N/A'; }
                              return (<div key={metric} className="bg-white/10 dark:bg-black/25 p-4 rounded-lg backdrop-blur-sm ring-1 ring-white/20">
                                  <div className="text-xs uppercase tracking-wider text-green-200 dark:text-emerald-200 mb-1">{metric}</div>
                                  <div className="text-2xl font-semibold text-white">{value}</div>
                              </div>);
                          })}
                          </div>
                      </div>
                  </div>
                </motion.div> 
              )}
              
              {offers.length > 1 && ( <> 
                <ComparisonChart results={results} countryCurrency={currentCurrencySymbol} /> 
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className={cardBaseClass}>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-6 border-b dark:border-neutral-700 pb-3">Detailed Side-by-Side Comparison</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                      <thead className="bg-gray-100 dark:bg-neutral-700/50"><tr><th scope="col" className={thClass}>Metric</th>{results.offers.map(offer => (<th key={offer.id} scope="col" className={`${thClass} ${offer.id === results.bestOfferId ? 'text-primary-600 dark:text-primary-400' : ''}`}>{offer.name} {offer.id === results.bestOfferId && <Check className="w-4 h-4 inline ml-1.5 text-green-500" />}</th>))}</tr></thead>
                      <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                        {[ { label: 'Annual Salary', path: 'salary', format: (val) => formatCurrency(val, currentCurrencySymbol) }, { label: 'Annual Bonus', path: 'bonus', format: (val) => formatCurrency(val, currentCurrencySymbol) }, { label: 'Retirement Match (%)', path: 'retirementMatchPercent', format: (val) => `${parseFloat(val || 0).toFixed(1)}%` }, { label: 'Retirement Benefit (Ann.)', path: 'calculated.retirementBenefitAnnual', format: (val) => formatCurrency(val, currentCurrencySymbol) }, { label: 'Gross Annual Compensation', path: 'calculated.grossAnnualCompensation', format: (val) => formatCurrency(val, currentCurrencySymbol), isBold: true }, { label: 'Est. Total Tax (Ann.)', path: 'calculated.totalTaxAnnual', format: (val) => formatCurrency(val, currentCurrencySymbol) }, { label: 'Net Income (after tax on salary/bonus)', path: 'calculated.netIncomeAnnual', format: (val) => formatCurrency(val, currentCurrencySymbol) }, { label: 'Net Total Compensation (Ann.)', path: 'calculated.netTotalCompensationAnnual', format: (val) => formatCurrency(val, currentCurrencySymbol), isBold: true }, { label: 'Monthly Health Insurance', path: 'healthInsuranceMonthlyCost', format: (val) => formatCurrency(val, currentCurrencySymbol) }, { label: 'Paid Vacation Days', path: 'paidVacationDays', format: (val) => `${val} days` }, { label: 'Remote Days / Week', path: 'remoteDaysPerWeek', format: (val) => `${val} days` }, { label: 'Commute (min/roundtrip)', path: 'commuteTimeOneWayMinutes', format: (val) => `${(parseFloat(val || 0) * 2).toFixed(0)} min` }, { label: 'Annual Commute Hours', path: 'calculated.annualCommuteHours', format: (val) => `${val.toFixed(0)} hrs` }, { label: 'Effective Net Hourly (Base)', path: 'calculated.effectiveHourlyRateNet', format: (val) => formatCurrency(val, currentCurrencySymbol) }, { label: 'Effective Net Hourly (Inc. Commute)', path: 'calculated.effectiveHourlyRateNetWithCommute', format: (val) => formatCurrency(val, currentCurrencySymbol) }, { label: 'Work-Life Score', path: 'calculated.scores.workLife', format: (val) => val.toFixed(1) }, { label: 'Benefits Score', path: 'calculated.scores.benefits', format: (val) => val.toFixed(1) }, { label: 'Financial Score', path: 'calculated.scores.financial', format: (val) => val.toFixed(1) }, { label: 'OVERALL SCORE', path: 'calculated.scores.overall', format: (val) => val.toFixed(1), isBold: true, isLarge: true }, ].map(metric => (<tr key={metric.label} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors"><td className={`${tdClass} font-medium text-sm text-gray-700 dark:text-gray-300 ${metric.isBold ? 'font-bold' : ''} ${metric.isLarge ? 'text-base' : ''}`}>{metric.label}</td>{results.offers.map(offer => { let value = metric.path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, offer); if (value === undefined && metric.path.startsWith('calculated.')) { const originalPath = metric.path.replace('calculated.', ''); value = originalPath.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, offer); } const displayValue = (value !== undefined && typeof value === 'number') ? metric.format(value) : (value !== undefined && value !== null ? value : 'N/A'); return (<td key={`${offer.id}-${metric.label}`} className={`${tdClass} text-sm text-right ${metric.isBold ? 'font-bold' : ''} ${metric.isLarge ? 'text-base' : ''} ${offer.id === results.bestOfferId ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{displayValue}</td>); })}</tr>))}
                      </tbody>
                    </table>
                  </div>
                </motion.div></>)}
              
              {offers.length === 1 && results && results.offers.length === 1 && ( <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className={cardBaseClass}>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4">Summary for: <span className="text-primary-600 dark:text-primary-400">{results.offers[0].name}</span></h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 dark:bg-neutral-700/60 p-4 rounded-lg"><p className="text-gray-500 dark:text-gray-400">Gross Annual Comp:</p><p className="font-semibold text-lg text-gray-800 dark:text-neutral-100">{formatCurrency(results.offers[0].calculated.grossAnnualCompensation, currentCurrencySymbol)}</p></div>
                  <div className="bg-gray-50 dark:bg-neutral-700/60 p-4 rounded-lg"><p className="text-gray-500 dark:text-gray-400">Net Total Comp (Est.):</p><p className="font-semibold text-lg text-gray-800 dark:text-neutral-100">{formatCurrency(results.offers[0].calculated.netTotalCompensationAnnual, currentCurrencySymbol)}</p></div>
                  <div className="bg-gray-50 dark:bg-neutral-700/60 p-4 rounded-lg"><p className="text-gray-500 dark:text-gray-400">Overall Score:</p><p className="font-semibold text-lg text-gray-800 dark:text-neutral-100">{results.offers[0].calculated.scores.overall.toFixed(1)} / 100</p></div>
                  <div className="bg-gray-50 dark:bg-neutral-700/60 p-4 rounded-lg"><p className="text-gray-500 dark:text-gray-400">Work-Life Score:</p><p className="font-semibold text-lg text-gray-800 dark:text-neutral-100">{results.offers[0].calculated.scores.workLife.toFixed(1)} / 100</p></div>
                </div>
              </motion.div>)}
            </div>
          ) : ( !isCalculating && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`${cardBaseClass} flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 py-12`} style={{minHeight: '300px'}}><Scale className="w-16 h-16 mb-6 text-gray-300 dark:text-neutral-600" /><p className="text-xl font-medium">Ready to Compare?</p><p className="text-base mt-1">Enter job offer details in the table above.</p></motion.div>))}
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: (results ? 0.4 : 0.2) }} className="mt-12 md:mt-16">
            <div className={`${cardBaseClass} grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10`}>
              <div className="border-b md:border-b-0 md:border-r border-gray-200 dark:border-neutral-700 pb-8 md:pb-0 md:pr-8">
                  <div className="flex items-center text-primary-600 dark:text-primary-400 mb-3"><Bookmark className="w-7 h-7 mr-2.5" /><h3 className="text-xl font-semibold text-gray-900 dark:text-white">Save This Tool</h3></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Making a big career decision? Bookmark this comparison tool for easy access as you evaluate your options.</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">(Tip: Press <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 dark:bg-neutral-600 dark:text-neutral-200 border border-gray-300 dark:border-neutral-500 rounded-md">Ctrl+D</kbd> or <kbd className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 dark:bg-neutral-600 dark:text-neutral-200 border border-gray-300 dark:border-neutral-500 rounded-md">Cmd+D</kbd> to bookmark)</p>
              </div>
              <div>
                <div className="flex items-center text-primary-600 dark:text-primary-400 mb-3"><Zap className="w-7 h-7 mr-2.5" /><h3 className="text-xl font-semibold text-gray-900 dark:text-white">Explore Other Tools</h3></div>
                <div className="space-y-3.5"> {/* Increased spacing */}
                    {relatedTools.map(tool => { const Icon = tool.icon; return (<Link key={tool.href} to={tool.href} className="group flex items-start p-3.5 bg-gray-50 dark:bg-neutral-700/60 hover:bg-primary-50 dark:hover:bg-neutral-700 rounded-lg transition-all duration-150 hover:shadow-md" aria-label={`Go to ${tool.title}`}><Icon className="w-6 h-6 text-primary-500 dark:text-primary-400 mr-3.5 mt-0.5 flex-shrink-0" /><div className="flex-grow"><p className="text-sm font-medium text-gray-800 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-300">{tool.title}</p><p className="text-xs text-gray-500 dark:text-gray-400">{tool.description}</p></div><ChevronRight className="w-5 h-5 text-gray-400 dark:text-neutral-500 ml-auto self-center group-hover:translate-x-1 transition-transform" /></Link>); })}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: (results ? 0.5 : 0.3) }} className="mt-12 md:mt-16">
            <div className={cardBaseClass}><div className="flex items-start space-x-4"><Info className="w-7 h-7 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" /><div><h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use This Comparison Tool</h3><div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none leading-relaxed"><p>Choosing between job offers involves more than just comparing base salaries. This tool helps you conduct a holistic analysis of each opportunity.</p><p className="font-semibold mt-4 mb-1.5">Key Metrics Explained:</p><ul className="list-disc list-inside space-y-1.5"><li><strong>Total Compensation:</strong> Salary + Bonus + value of Retirement Benefits. This gives a broader financial picture than salary alone.</li><li><strong>Net Income:</strong> Estimated take-home pay after taxes are deducted from salary and bonus.</li><li><strong>Effective Hourly Rate (Inc. Commute):</strong> Calculates your net hourly earnings considering total work hours plus annual commute time. A lower commute and higher pay improve this rate.</li><li><strong>Work-Life Score (0-100):</strong> A subjective score based on vacation days, commute time, and remote work flexibility. Higher is better.</li><li><strong>Benefits Score (0-100):</strong> A subjective score based on retirement matching percentage and health insurance costs. Higher is better.</li><li><strong>Financial Score (0-100):</strong> Reflects the attractiveness of the net total compensation, scaled for comparison.</li><li><strong>Overall Score (0-100):</strong> A weighted average of Financial (50%), Work-Life (30%), and Benefits (20%) scores to provide a single comparison metric.</li></ul><p className="mt-4">Use this tool to quantify different aspects of job offers. Remember to also consider non-quantifiable factors like company culture, career growth opportunities, and personal fit.</p><p className="mt-4 font-semibold text-red-600 dark:text-red-400">Disclaimer: All calculations, especially tax estimations and scores, are for informational and comparative purposes. Tax laws vary and depend on individual circumstances (filing status, specific deductions, etc.). The scoring system is subjective. Always consult with financial and tax professionals for personalized advice.</p></div></div></div></div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ComparisonTool;