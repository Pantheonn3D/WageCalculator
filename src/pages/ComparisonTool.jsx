import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Scale, Download, Share2, Info, Plus, Trash2, Check, Award, Bookmark,
    DollarSign, Clock, Receipt, PiggyBank as SavingsIcon, ChevronRight, Layers,
    Zap, TrendingUp, Target, BarChart3, Users, CheckCircle, ArrowRight, BookOpen,
    Shield, Globe, Calculator, PieChart
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

const FEATURED_BENEFITS = [
  "Side-by-side offer comparison",
  "Comprehensive scoring system", 
  "Tax-adjusted calculations",
  "Export detailed analysis"
];

const COMPARISON_FEATURES = [
  { icon: Zap, title: 'Smart Analysis', description: 'AI-powered scoring considers salary, benefits, and work-life balance' },
  { icon: Globe, title: 'Global Accuracy', description: 'Precise tax calculations and regional cost considerations' },
  { icon: Shield, title: 'Privacy First', description: 'All comparisons happen locally - your sensitive data never leaves your device' },
  { icon: Award, title: 'Professional Grade', description: 'Used by career coaches and HR professionals for objective evaluations' }
];

const relatedTools = [
    { title: 'Salary Calculator', href: '/salary-calculator', icon: DollarSign, description: "Understand your gross vs. net pay breakdown" },
    { title: 'Tax Calculator', href: '/tax-calculator', icon: Receipt, description: "Estimate your income tax burden accurately" },
    { title: 'Savings Goal Planner', href: '/savings-calculator', icon: SavingsIcon, description: "Plan how to reach your financial goals" },
    { title: 'Budget Calculator', href: '/budget-calculator', icon: PieChart, description: "Create comprehensive monthly budget plans" },
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
        const taxInfo = (salary + bonus > 0) ? calculateTax(salary + bonus, selectedCountry, taxParams) : { totalTax: 0, taxableIncome: salary + bonus };
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
  
  const inputFieldClass = "w-full p-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white dark:bg-neutral-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-neutral-700/50 placeholder-gray-400 dark:placeholder-neutral-500 transition-all duration-200";
  const thClass = "text-left py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider sticky top-0 bg-gray-50 dark:bg-neutral-700/80 z-10 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-600";
  const tdClass = "py-4 px-4 whitespace-nowrap border-b border-gray-100 dark:border-neutral-700/50";
  const cardBaseClass = "bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-neutral-700";
  const heroGradientClass = "bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800";
  const standoutGradientClass = "bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700";

  // Animation variants
  const fadeInY = (delay = 0, duration = 0.5) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration, delay, ease: "circOut" } },
  });

  return (
    <>
      <SEOHead 
        title={`Job Offer Comparison Calculator ${currentCountryName} 2024 - Compare Salary & Benefits`}
        description={`Make smarter career decisions with our comprehensive job offer comparison tool for ${currentCountryName}. Compare salary, benefits, work-life balance, and net pay after taxes. Get detailed analysis with scoring system to choose the best offer.`}
        keywords={`job offer comparison tool ${currentCountryName}, salary comparison calculator ${currentCountryName}, benefits analyzer ${currentCountryName}, net income calculator job offer, career decision tool ${currentCountryName}, job offer evaluator ${currentCountryName}, compare compensation packages ${currentCountryName}, salary vs benefits calculator, job offer analyzer, employment comparison tool`}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        {/* Hero Section */}
        <section className="gradient-bg text-white relative overflow-hidden py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              variants={fadeInY(0.1, 0.8)}
              initial="initial"
              animate="animate"
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Scale className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  Job Offer Comparison Tool
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
                Make the smartest career decision with comprehensive side-by-side analysis of multiple job offers in {currentCountryName}. 
                Compare salary, benefits, work-life balance, and true take-home value.
              </p>
              
              {/* Benefits Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                {FEATURED_BENEFITS.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    variants={fadeInY(0.3 + index * 0.1, 0.5)}
                    initial="initial"
                    animate="animate"
                    className="flex items-center space-x-2 text-sm md:text-base"
                  >
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-blue-100">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Comparison Section */}
        <section className="py-12 md:py-16 -mt-8 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className={cardBaseClass}>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b dark:border-neutral-700 pb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                    <Layers className="w-8 h-8 inline-block mr-3 text-primary-500 dark:text-primary-400" />
                    Enter Offer Details
                  </h2>
                  <button 
                    onClick={addNewOffer} 
                    disabled={offers.length >= MAX_OFFERS} 
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border-2 border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 dark:disabled:bg-neutral-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5 mr-2 -ml-1" /> Add Offer
                  </button>
                </div>
                
                <div className="mb-8 max-w-md">
                  <label htmlFor="filingStatus" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tax Filing Status (for all offers)</label>
                  <select 
                    id="filingStatus" 
                    name="filingStatus" 
                    value={filingStatus} 
                    onChange={(e) => setFilingStatus(e.target.value)} 
                    className={inputFieldClass}
                  >
                    <option value="single">Single</option>
                    <option value="married_jointly">Married Filing Jointly</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">This status is used for tax estimations across all job offers.</p>
                </div>
                
                <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-xl border-2 border-gray-200 dark:border-neutral-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead className="bg-gray-50 dark:bg-neutral-800"> 
                      <tr>
                        <th scope="col" className={`${thClass} rounded-tl-xl`}>Job Name</th> 
                        <th scope="col" className={thClass}>Salary ({currentCurrencySymbol})</th> 
                        <th scope="col" className={thClass}>Bonus ({currentCurrencySymbol})</th> 
                        <th scope="col" className={thClass}>Retirement Match (%)</th> 
                        <th scope="col" className={thClass}>Health Ins. (Monthly {currentCurrencySymbol})</th> 
                        <th scope="col" className={thClass}>Vacation Days</th> 
                        <th scope="col" className={thClass}>Commute (min/way)</th> 
                        <th scope="col" className={thClass}>Remote Days/Week</th> 
                        <th scope="col" className={`${thClass} rounded-tr-xl`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                      {offers.map((offer) => (
                        <tr key={offer.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors">
                          <td className={tdClass}>
                            <input 
                              type="text" 
                              value={offer.name} 
                              onChange={(e) => handleOfferChange(offer.id, 'name', e.target.value)} 
                              className={inputFieldClass} 
                              placeholder="e.g., Company A" 
                            />
                          </td>
                          <td className={tdClass}>
                            <input 
                              type="number" 
                              value={offer.salary} 
                              onChange={(e) => handleOfferChange(offer.id, 'salary', e.target.value)} 
                              className={inputFieldClass} 
                              placeholder="75000" 
                              min="0" 
                            />
                          </td>
                          <td className={tdClass}>
                            <input 
                              type="number" 
                              value={offer.bonus} 
                              onChange={(e) => handleOfferChange(offer.id, 'bonus', e.target.value)} 
                              className={inputFieldClass} 
                              placeholder="5000" 
                              min="0"
                            />
                          </td>
                          <td className={tdClass}>
                            <input 
                              type="number" 
                              value={offer.retirementMatchPercent} 
                              onChange={(e) => handleOfferChange(offer.id, 'retirementMatchPercent', e.target.value)} 
                              className={inputFieldClass} 
                              placeholder="3" 
                              step="0.1" 
                              min="0"
                            />
                          </td>
                          <td className={tdClass}>
                            <input 
                              type="number" 
                              value={offer.healthInsuranceMonthlyCost} 
                              onChange={(e) => handleOfferChange(offer.id, 'healthInsuranceMonthlyCost', e.target.value)} 
                              className={inputFieldClass} 
                              placeholder="300" 
                              min="0"
                            />
                          </td>
                          <td className={tdClass}>
                            <input 
                              type="number" 
                              value={offer.paidVacationDays} 
                              onChange={(e) => handleOfferChange(offer.id, 'paidVacationDays', e.target.value)} 
                              className={inputFieldClass} 
                              placeholder="15" 
                              min="0"
                            />
                          </td>
                          <td className={tdClass}>
                            <input 
                              type="number" 
                              value={offer.commuteTimeOneWayMinutes} 
                              onChange={(e) => handleOfferChange(offer.id, 'commuteTimeOneWayMinutes', e.target.value)} 
                              className={inputFieldClass} 
                              placeholder="30" 
                              min="0"
                            />
                          </td>
                          <td className={tdClass}>
                            <select 
                              value={offer.remoteDaysPerWeek} 
                              onChange={(e) => handleOfferChange(offer.id, 'remoteDaysPerWeek', e.target.value)} 
                              className={inputFieldClass}
                            >
                              {[0,1,2,3,4,5].map(d => 
                                <option key={d} value={d}>{d === 5 ? 'Full Remote' : `${d} day${d === 1 ? '' : 's'}`}</option>
                              )}
                            </select>
                          </td>
                          <td className={`${tdClass} text-center`}>
                            <button 
                              onClick={() => deleteOffer(offer.id)} 
                              disabled={offers.length <= 1} 
                              title="Delete Offer"
                              className={`p-3 rounded-xl transition-all duration-200 ${ 
                                offers.length <= 1 
                                  ? 'bg-gray-200 dark:bg-neutral-700 text-gray-400 dark:text-neutral-500 cursor-not-allowed' 
                                  : 'text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-700/50 transform hover:scale-110'
                              }`}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {results && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4"
                  >
                    <button 
                      onClick={exportResults} 
                      aria-label="Export comparison results as JSON" 
                      className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 dark:border-neutral-600 shadow-sm text-sm font-bold rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                    >
                      <Download className="w-5 h-5 mr-2 -ml-1" /> Export Results
                    </button>
                    <button 
                      onClick={shareResults} 
                      aria-label="Share comparison results" 
                      className="inline-flex items-center justify-center px-6 py-3 border-2 border-transparent shadow-sm text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 transition-all duration-200"
                    >
                      <Share2 className="w-5 h-5 mr-2 -ml-1" /> Share Comparison
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {isCalculating && !results ? ( 
              <motion.div 
                className={`${cardBaseClass} flex flex-col items-center justify-center text-center py-16`} 
                style={{minHeight: '400px'}}
              >
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 dark:border-primary-400 mb-6"></div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Analyzing Your Offers</h3>
                <p className="text-gray-500 dark:text-gray-400">Processing tax calculations and scoring...</p>
              </motion.div>
            ) : results ? (
              <div className="space-y-8 md:space-y-12">
                {offers.length === 1 && results.offers.length === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`${heroGradientClass} text-white shadow-2xl rounded-2xl p-8 md:p-12 text-center relative overflow-hidden ring-4 ring-white/20 dark:ring-primary-500/30`}
                  >
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full opacity-50"></div>
                    <div className="absolute -bottom-12 -right-8 w-40 h-40 bg-white/5 rounded-full opacity-50"></div>
                    <Layers className="w-16 h-16 mx-auto mb-6 text-white/80 relative z-10" /> 
                    <h3 className="text-3xl lg:text-4xl font-bold mb-6 relative z-10">Ready for a Full Comparison?</h3>
                    <p className="text-primary-100 dark:text-blue-200 mb-10 max-w-2xl mx-auto text-lg relative z-10">
                      You've analyzed one offer. Add another to unlock powerful side-by-side analysis, detailed charts, and our intelligent recommendation system!
                    </p>
                    <button 
                      onClick={addNewOffer} 
                      disabled={offers.length >= MAX_OFFERS}
                      className="bg-white text-primary-600 dark:text-primary-700 px-12 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 dark:hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/80 disabled:opacity-70 disabled:cursor-not-allowed relative z-10"
                    > 
                      <Plus className="w-6 h-6 mr-3 inline-block -ml-1" /> Add Another Offer 
                    </button>
                  </motion.div>
                )}

                {offers.length > 1 && results.bestOfferId && ( 
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`${standoutGradientClass} text-white shadow-2xl rounded-2xl p-8 md:p-10 ring-4 ring-green-300 dark:ring-emerald-500/70`}
                  > 
                    <div className="flex flex-col md:flex-row items-center md:space-x-8 relative z-10">
                        <div className="mb-8 md:mb-0 bg-white/20 p-6 rounded-full shrink-0 backdrop-blur-sm ring-1 ring-white/30">
                            <Award className="w-12 h-12 md:w-14 md:h-14 text-white" />
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-sm uppercase tracking-wider text-green-200 dark:text-emerald-200 font-bold mb-2">🏆 Top Recommendation</p>
                            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                              {results.offers.find(o => o.id === results.bestOfferId)?.name || 'N/A'}
                            </h3>
                            <p className="text-green-100 dark:text-emerald-100 mb-8 text-lg max-w-2xl">
                                This offer provides the best overall value based on our comprehensive analysis of financial rewards, benefits package, and work-life balance factors.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                            {(['Total Compensation', 'Net Income', 'Overall Score']).map(metric => {
                                const offer = results.offers.find(o => o.id === results.bestOfferId)?.calculated; 
                                let value;
                                if (offer) { 
                                  if (metric === 'Total Compensation') value = formatCurrency(offer.grossAnnualCompensation, currentCurrencySymbol); 
                                  else if (metric === 'Net Income') value = formatCurrency(offer.netTotalCompensationAnnual, currentCurrencySymbol); 
                                  else if (metric === 'Overall Score') value = offer.scores.overall.toFixed(1); 
                                } else { value = 'N/A'; }
                                return (
                                  <div key={metric} className="bg-white/10 dark:bg-black/25 p-5 rounded-xl backdrop-blur-sm ring-1 ring-white/20">
                                      <div className="text-xs uppercase tracking-wider text-green-200 dark:text-emerald-200 mb-2 font-semibold">{metric}</div>
                                      <div className="text-2xl font-bold text-white">{value}</div>
                                  </div>
                                );
                            })}
                            </div>
                        </div>
                    </div>
                  </motion.div> 
                )}
                
                {offers.length > 1 && ( 
                  <> 
                    <ComparisonChart results={results} countryCurrency={currentCurrencySymbol} /> 
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ duration: 0.5, delay: 0.3 }} 
                      className={cardBaseClass}
                    >
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b dark:border-neutral-700 pb-4 flex items-center">
                        <BarChart3 className="w-8 h-8 mr-3 text-primary-600 dark:text-primary-400" />
                        Detailed Side-by-Side Comparison
                      </h3>
                      <div className="overflow-x-auto rounded-xl border-2 border-gray-200 dark:border-neutral-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                          <thead className="bg-gray-50 dark:bg-neutral-700/50">
                            <tr>
                              <th scope="col" className={thClass}>Metric</th>
                              {results.offers.map(offer => (
                                <th key={offer.id} scope="col" className={`${thClass} ${offer.id === results.bestOfferId ? 'text-primary-600 dark:text-primary-400' : ''}`}>
                                  {offer.name} 
                                  {offer.id === results.bestOfferId && <Check className="w-4 h-4 inline ml-2 text-green-500" />}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                            {[ 
                              { label: 'Annual Salary', path: 'salary', format: (val) => formatCurrency(val, currentCurrencySymbol) }, 
                              { label: 'Annual Bonus', path: 'bonus', format: (val) => formatCurrency(val, currentCurrencySymbol) }, 
                              { label: 'Retirement Match (%)', path: 'retirementMatchPercent', format: (val) => `${parseFloat(val || 0).toFixed(1)}%` }, 
                              { label: 'Retirement Benefit (Ann.)', path: 'calculated.retirementBenefitAnnual', format: (val) => formatCurrency(val, currentCurrencySymbol) }, 
                              { label: 'Gross Annual Compensation', path: 'calculated.grossAnnualCompensation', format: (val) => formatCurrency(val, currentCurrencySymbol), isBold: true }, 
                              { label: 'Est. Total Tax (Ann.)', path: 'calculated.totalTaxAnnual', format: (val) => formatCurrency(val, currentCurrencySymbol) }, 
                              { label: 'Net Income (after tax on salary/bonus)', path: 'calculated.netIncomeAnnual', format: (val) => formatCurrency(val, currentCurrencySymbol) }, 
                              { label: 'Net Total Compensation (Ann.)', path: 'calculated.netTotalCompensationAnnual', format: (val) => formatCurrency(val, currentCurrencySymbol), isBold: true }, 
                              { label: 'Monthly Health Insurance', path: 'healthInsuranceMonthlyCost', format: (val) => formatCurrency(val, currentCurrencySymbol) }, 
                              { label: 'Paid Vacation Days', path: 'paidVacationDays', format: (val) => `${val} days` }, 
                              { label: 'Remote Days / Week', path: 'remoteDaysPerWeek', format: (val) => `${val} days` }, 
                              { label: 'Commute (min/roundtrip)', path: 'commuteTimeOneWayMinutes', format: (val) => `${(parseFloat(val || 0) * 2).toFixed(0)} min` }, 
                              { label: 'Annual Commute Hours', path: 'calculated.annualCommuteHours', format: (val) => `${val.toFixed(0)} hrs` }, 
                              { label: 'Effective Net Hourly (Base)', path: 'calculated.effectiveHourlyRateNet', format: (val) => formatCurrency(val, currentCurrencySymbol) }, 
                              { label: 'Effective Net Hourly (Inc. Commute)', path: 'calculated.effectiveHourlyRateNetWithCommute', format: (val) => formatCurrency(val, currentCurrencySymbol) }, 
                              { label: 'Work-Life Score', path: 'calculated.scores.workLife', format: (val) => val.toFixed(1) }, 
                              { label: 'Benefits Score', path: 'calculated.scores.benefits', format: (val) => val.toFixed(1) }, 
                              { label: 'Financial Score', path: 'calculated.scores.financial', format: (val) => val.toFixed(1) }, 
                              { label: 'OVERALL SCORE', path: 'calculated.scores.overall', format: (val) => val.toFixed(1), isBold: true, isLarge: true }, 
                            ].map(metric => (
                              <tr key={metric.label} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors">
                                <td className={`${tdClass} font-medium text-sm text-gray-700 dark:text-gray-300 ${metric.isBold ? 'font-bold' : ''} ${metric.isLarge ? 'text-base' : ''}`}>
                                  {metric.label}
                                </td>
                                {results.offers.map(offer => { 
                                  let value = metric.path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, offer); 
                                  if (value === undefined && metric.path.startsWith('calculated.')) { 
                                    const originalPath = metric.path.replace('calculated.', ''); 
                                    value = originalPath.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, offer); 
                                  } 
                                  const displayValue = (value !== undefined && typeof value === 'number') ? metric.format(value) : (value !== undefined && value !== null ? value : 'N/A'); 
                                  return (
                                    <td key={`${offer.id}-${metric.label}`} className={`${tdClass} text-sm text-right ${metric.isBold ? 'font-bold' : ''} ${metric.isLarge ? 'text-base' : ''} ${offer.id === results.bestOfferId ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                      {displayValue}
                                    </td>
                                  ); 
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  </>
                )}
                
                {offers.length === 1 && results && results.offers.length === 1 && ( 
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, delay: 0.2 }} 
                    className={cardBaseClass}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Summary for: <span className="text-primary-600 dark:text-primary-400">{results.offers[0].name}</span></h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                      <div className="bg-gray-50 dark:bg-neutral-700/60 p-6 rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">Gross Annual Comp:</p>
                        <p className="font-bold text-xl text-gray-800 dark:text-neutral-100">{formatCurrency(results.offers[0].calculated.grossAnnualCompensation, currentCurrencySymbol)}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-neutral-700/60 p-6 rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">Net Total Comp (Est.):</p>
                        <p className="font-bold text-xl text-gray-800 dark:text-neutral-100">{formatCurrency(results.offers[0].calculated.netTotalCompensationAnnual, currentCurrencySymbol)}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-neutral-700/60 p-6 rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">Overall Score:</p>
                        <p className="font-bold text-xl text-gray-800 dark:text-neutral-100">{results.offers[0].calculated.scores.overall.toFixed(1)} / 100</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-neutral-700/60 p-6 rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400 font-semibold mb-1">Work-Life Score:</p>
                        <p className="font-bold text-xl text-gray-800 dark:text-neutral-100">{results.offers[0].calculated.scores.workLife.toFixed(1)} / 100</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : ( 
              !isCalculating && ( 
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className={`${cardBaseClass} flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 py-16`} 
                  style={{minHeight: '400px'}}
                >
                  <Scale className="w-20 h-20 mb-8 text-gray-300 dark:text-neutral-600" />
                  <h3 className="text-2xl font-bold mb-3">Ready to Compare Job Offers?</h3>
                  <p className="text-lg mb-4">Enter job offer details in the table above to begin your analysis.</p>
                  <p className="text-sm">Our tool will provide comprehensive scoring and recommendations.</p>
                </motion.div>
              )
            )}
        </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20 bg-white dark:bg-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInY(0, 0.7)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Our Comparison Tool is Different
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Go beyond basic salary comparison with our comprehensive analysis that considers every aspect of your total compensation package.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {COMPARISON_FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={fadeInY(0.1 + index * 0.05, 0.6)}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.1 }}
                    className="text-center p-8 bg-gray-50 dark:bg-neutral-700 rounded-2xl hover:shadow-lg transition-all duration-300 group border border-gray-200 dark:border-neutral-600"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-neutral-100 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="py-16 md:py-20 bg-gray-50 dark:bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInY(0, 0.7)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Complete Your Career Decision Toolkit
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Enhance your job offer analysis with our comprehensive suite of financial calculators.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.title}
                    variants={fadeInY(0.1 + index * 0.05, 0.6)}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    <Link
                      to={tool.href}
                      className="group block p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-500 h-full"
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-xl group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors">
                          <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <h3 className="ml-3 text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {tool.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {tool.description}
                      </p>
                      <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300">
                        Try Calculator
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comprehensive Guide Section */}
        <section className="py-20 md:py-24 bg-white dark:bg-neutral-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={fadeInY(0, 0.7)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.2 }}
              className="text-center mb-16"
            >
              <BookOpen className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Complete Guide to Job Offer Evaluation in {currentCountryName}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Master the art of comparing job offers with our comprehensive guide covering salary analysis, 
                benefits evaluation, and strategic career decision-making in {currentCountryName}.
              </p>
            </motion.div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <motion.div
                variants={fadeInY(0.1, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-gray-50 dark:bg-neutral-700 rounded-2xl p-8 mb-12"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <DollarSign className="w-8 h-8 text-primary-600 dark:text-primary-400 mr-3" />
                  Beyond Base Salary: Understanding Total Compensation
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  When evaluating job offers in {currentCountryName}, looking only at base salary can lead to costly mistakes. 
                  Total compensation includes your base salary, bonuses, equity, retirement benefits, health insurance, 
                  and other perks that significantly impact your financial well-being.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Our comparison tool calculates the true value of each offer by considering tax implications specific to {currentCountryName}, 
                  retirement matching contributions, healthcare costs, and time value factors like commute and vacation days. 
                  This comprehensive approach reveals the real financial impact of each opportunity.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Remember that a lower base salary with excellent benefits might actually provide better long-term value 
                  than a higher salary with minimal benefits. Our scoring system weighs all these factors to give you 
                  an objective comparison that goes far beyond simple salary numbers.
                </p>
              </motion.div>

              <motion.div
                variants={fadeInY(0.2, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="grid md:grid-cols-2 gap-8 mb-12"
              >
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                    Financial Scoring Methodology
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Our financial score considers net take-home pay after taxes, retirement contributions, and mandatory deductions. 
                    We factor in {currentCountryName}'s specific tax rates and social security contributions to provide accurate 
                    net compensation estimates.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    The scoring system also evaluates the monetary value of benefits like employer retirement matching, 
                    health insurance subsidies, and other perks that directly impact your financial position.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Clock className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                    Work-Life Balance Analysis
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    Beyond compensation, our tool evaluates work-life balance factors including vacation days, 
                    commute time, and remote work flexibility. These elements significantly impact your quality 
                    of life and should be weighted in your decision.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We calculate the time cost of commuting and translate it into an effective hourly rate, 
                    helping you understand the true value of your time investment for each opportunity.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInY(0.3, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-8 mb-12"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Award className="w-8 h-8 text-amber-600 dark:text-amber-400 mr-3" />
                  Strategic Decision-Making Framework
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Short-term vs Long-term Value</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Consider not just immediate compensation but also career growth potential, skill development 
                      opportunities, and industry trajectory when evaluating offers.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Hidden Costs and Benefits</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Factor in relocation costs, equipment stipends, professional development budgets, and other 
                      benefits that may not be immediately obvious but add significant value.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Risk Assessment</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      Evaluate company stability, industry volatility, and job security alongside compensation. 
                      Sometimes a slightly lower offer from a stable company is the wiser choice.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInY(0.4, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-8 mb-12"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
                  Practical Application Guidelines
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Gathering Comprehensive Information</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Before using our comparison tool, ensure you have complete information about each offer. Request detailed 
                      benefit summaries, ask about retirement matching formulas, understand health insurance options, and 
                      clarify vacation policies. The accuracy of your comparison depends on the completeness of your input data.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Negotiation Strategy</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Use the comparison results to inform your negotiation strategy. If one offer scores higher on benefits 
                      but lower on salary, you might negotiate for increased base pay. Understanding the total value helps 
                      you make strategic trade-offs and present compelling cases for improvement.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Personal Priority Weighting</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      While our tool uses standard weightings (50% financial, 30% work-life, 20% benefits), consider your 
                      personal priorities. If work-life balance is crucial for your situation, mentally adjust the scores 
                      accordingly. The tool provides objective analysis, but your subjective preferences should guide the 
                      final decision.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInY(0.5, 0.7)}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-gray-100 dark:bg-neutral-700 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Common Questions About Job Offer Comparison</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How accurate are the tax calculations for {currentCountryName}?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Our tool uses current tax rates and standard deductions for {currentCountryName}. While highly accurate 
                      for most situations, individual circumstances like additional deductions or credits may affect your actual 
                      tax liability. The estimates provide excellent comparative value even if not perfectly precise.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Should I always choose the highest-scoring offer?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      The scoring system provides objective analysis, but consider factors beyond our metrics like company 
                      culture, growth opportunities, job satisfaction, and personal career goals. Use the scores as one 
                      important input in your decision-making process.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I adjust the scoring weights to match my priorities?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Currently, our tool uses fixed weights, but you can mentally adjust the importance of each category 
                      based on your personal situation. We're considering adding customizable weights in future updates 
                      to provide even more personalized analysis.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How should I handle equity compensation or stock options?</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      For equity compensation, estimate the potential annual value and include it in the bonus field. 
                      Remember that equity carries risk and may not vest immediately. Consider creating multiple scenarios 
                      with different equity valuations to understand the range of possible outcomes.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 gradient-bg text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              variants={fadeInY(0, 0.8)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Master Your Financial Future Today
              </h2>
              <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
                Take control of your finances with accurate salary calculations and comprehensive financial planning tools. 
                Join thousands who trust our calculators for their financial decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/all-calculators"
                  className="bg-white text-primary-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-300"
                >
                  Explore All Calculators
                </Link>
                <Link
                  to="/financial-guides"
                  className="glass-effect text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/25 transition-all duration-200 flex items-center group focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  Read Financial Guides
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="py-12 bg-gray-100 dark:bg-neutral-800"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-neutral-700 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-neutral-600">
              <div className="flex items-start space-x-4">
                <Info className="w-8 h-8 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Important Disclaimer
                  </h3>
                  <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none">
                    <p className="mb-3">
                      This job offer comparison tool provides estimates and analysis for informational purposes only. 
                      Results should not be considered as professional financial, tax, or career advice for {currentCountryName}.
                    </p>
                    <p className="mb-3">
                      Tax calculations are based on standard rates and may not reflect your specific situation. Benefits 
                      valuations are estimates and actual value may vary. Scoring methodology is designed for general 
                      comparison but may not align with your personal priorities or circumstances.
                    </p>
                    <p className="font-semibold text-amber-600 dark:text-amber-400">
                      Always consult with qualified financial advisors, tax professionals, and career counselors for 
                      personalized guidance on important career decisions. This tool should supplement, not replace, 
                      professional advice and your own careful consideration of all factors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ComparisonTool;