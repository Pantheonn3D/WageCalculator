// src/pages/legal/DisclaimerPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Info, Edit3, Mail, List as ListIcon } from 'lucide-react'; // Using AlertTriangle for disclaimer
import SEOHead from '../../components/seo/SEOHead';

// Helper function to generate slugs for heading IDs
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

const DisclaimerPage = () => {
  const lastUpdatedDate = "October 26, 2023"; // Replace with your actual last updated date
  const navigate = useNavigate();

  // Manually define the Table of Contents for this specific policy
  const policySections = [
    { text: "Important Notice", id: slugify("Important Notice") },
    { text: "General Disclaimer", id: slugify("General Disclaimer") },
    { text: "Financial Information Disclaimer", id: slugify("Financial Information Disclaimer") },
    { text: "Calculator Accuracy Disclaimer", id: slugify("Calculator Accuracy Disclaimer") },
    { text: "Tax Information Disclaimer", id: slugify("Tax Information Disclaimer") },
    { text: "Investment Information Disclaimer", id: slugify("Investment Information Disclaimer") },
    { text: "Professional Advice Recommendation", id: slugify("Professional Advice Recommendation") },
    { text: "Regional and Legal Variations", id: slugify("Regional and Legal Variations") },
    { text: "Data Entry and Privacy", id: slugify("Data Entry and Privacy") },
    { text: "Limitation of Liability", id: slugify("Limitation of Liability") },
    { text: "Third-Party Content and Links", id: slugify("Third-Party Content and Links") },
    { text: "Updates and Changes", id: slugify("Updates and Changes") },
    { text: "No Guarantees", id: slugify("No Guarantees") },
    { text: "Your Responsibility", id: slugify("Your Responsibility") },
    { text: "Contact Information", id: slugify("Contact Information") },
    { text: "Final Reminder", id: slugify("Final Reminder") },
  ];

  const [activeTocId, setActiveTocId] = useState(policySections[0]?.id || '');
  const contentRef = useRef(null);

  // Intersection Observer for highlighting active ToC item
  useEffect(() => {
    if (!policySections.length || !contentRef.current) return;
    // ... (IntersectionObserver logic - same as in CookiePolicyPage and GuideDetailPage) ...
    const observerCallback = (entries) => {
      let currentActive = activeTocId; 
      let highestIntersectionRatio = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.intersectionRatio > highestIntersectionRatio) {
            highestIntersectionRatio = entry.intersectionRatio;
            currentActive = entry.target.id;
          }
        }
      });
      if (highestIntersectionRatio < 0.1 && entries.some(e => e.isIntersecting)) {
         const firstVisible = entries
            .filter(e => e.isIntersecting)
            .sort((a,b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top)[0];
         if (firstVisible) {
            currentActive = firstVisible.target.id;
         }
      }
      setActiveTocId(currentActive);
    };
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: [0, 0.1, 0.5, 1.0],
    });
    const elements = policySections.map(item => document.getElementById(item.id)).filter(Boolean);
    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => { if (el) observer.unobserve(el); });
  }, [policySections, activeTocId]);

  // Define explicit heading classes
  const h2PolicyClasses = "text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-5 pb-3 border-b border-gray-200 scroll-mt-24";
  // H3 for the notice/reminder boxes will be styled specially
  const h3PolicyClasses = "text-xl md:text-2xl font-bold text-gray-800 mt-8 mb-4 scroll-mt-24"; 
  
  const proseBlockClasses = "prose prose-lg max-w-none prose-indigo prose-p:mb-5 prose-p:leading-relaxed prose-ul:list-disc prose-ul:list-inside prose-ul:pl-0 prose-ul:mb-5 prose-li:my-1 prose-li:mb-2 prose-strong:font-semibold hover:prose-a:text-primary-600 prose-a:font-medium hover:prose-a:underline";

  return (
    <>
      <SEOHead 
        title="Disclaimer | WageCalculator"
        description="Important disclaimers about the financial information and calculator results provided by WageCalculator."
        keywords="disclaimer, financial disclaimer, calculator accuracy, financial advice, legal notice"
      />

      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 text-white pt-10 pb-12 md:pt-16 md:pb-20 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center bg-white/10 p-4 rounded-full mb-5 shadow-sm backdrop-blur-sm">
              <AlertTriangle className="w-10 h-10 text-slate-300" /> {/* Icon for Disclaimer */}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-balance">
              Disclaimer
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Important information regarding the use of WageCalculator services and content.
            </p>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="lg:flex lg:gap-x-12">
            {policySections.length > 0 && (
              <aside className="hidden lg:block lg:w-1/4 xl:w-1/5 flex-shrink-0">
                <div className="sticky top-24 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2 flex items-center">
                    <ListIcon className="w-5 h-5 mr-2 text-slate-600" />
                    Disclaimer Sections
                  </h3>
                  <nav>
                    <ul className="space-y-1.5 max-h-[calc(100vh-12rem)] overflow-y-auto">
                      {policySections.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const element = document.getElementById(item.id);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                                setActiveTocId(item.id); 
                                navigate(`#${item.id}`, { replace: true });
                              }
                            }}
                            className={`block text-sm py-1 px-2 rounded-md transition-all duration-150
                              ${activeTocId === item.id
                                ? 'bg-slate-100 text-slate-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-slate-700'
                              }`}
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </aside>
            )}

            <main ref={contentRef} className="flex-grow lg:w-3/4 xl:w-4/5 bg-white rounded-xl shadow-xl overflow-hidden">
              <article className="p-6 sm:p-8 lg:p-10">
                <div className="flex items-center text-sm text-gray-500 mb-8 border-b border-gray-200 pb-4">
                  <Edit3 size={18} className="mr-2 text-gray-400" />
                  <span>
                    <strong>Last updated:</strong> {lastUpdatedDate}
                  </span>
                </div>

                {/* Special Notice Box - outside regular prose flow for distinct styling */}
                <div id={slugify("Important Notice")} className="mb-10 p-6 bg-red-50 border-l-4 border-red-500 rounded-r-md scroll-mt-24">
                    <h2 className="text-xl font-bold text-red-800 mb-2 flex items-center">
                        <AlertTriangle size={20} className="mr-2 text-red-700" />
                        Important Notice
                    </h2>
                    <p className="text-red-700 font-medium leading-relaxed">
                    WageCalculator is not a financial advisor and does not provide financial, investment, tax, or legal advice. The information and tools provided on this website are for educational and informational purposes only.
                    </p>
                </div>
                
                <h2 id={slugify("General Disclaimer")} className={h2PolicyClasses}>General Disclaimer</h2>
                <div className={proseBlockClasses}>
                  <p>
                    The information contained on WageCalculator and its related calculators, guides, and content is provided on an "as is" basis. While we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website.
                  </p>
                </div>
                
                <h2 id={slugify("Financial Information Disclaimer")} className={h2PolicyClasses}>Financial Information Disclaimer</h2>
                <div className={proseBlockClasses}>
                  <p>
                    <strong>The financial information, calculations, and guidance provided on this website are for educational purposes only and should not be considered as professional financial advice.</strong>
                  </p>
                  <p>
                    All financial calculations are estimates based on the information you provide and general assumptions. These calculations should be used as guidelines only and may not reflect actual results due to various factors including but not limited to:
                  </p>
                  <ul>
                    <li>Changes in tax laws, regulations, and rates</li>
                    <li>Individual circumstances not accounted for in our calculations</li>
                    <li>Market conditions and economic fluctuations</li>
                    <li>Differences in local, state, and federal regulations</li>
                    <li>Employer-specific policies and benefit structures</li>
                    <li>Personal financial situations and goals</li>
                  </ul>
                </div>

                <h2 id={slugify("Calculator Accuracy Disclaimer")} className={h2PolicyClasses}>Calculator Accuracy Disclaimer</h2>
                <div className={proseBlockClasses}>
                  <p>
                    Our financial calculators use standard formulas and assumptions that may not apply to every situation. Results should be considered estimates only. We strongly recommend that you:
                  </p>
                  <ul>
                    <li>Verify all calculations independently</li>
                    <li>Consult with qualified financial professionals</li>
                    <li>Consider your specific circumstances and goals</li>
                    <li>Understand the limitations and assumptions of each calculator</li>
                  </ul>
                </div>
                
                <h2 id={slugify("Tax Information Disclaimer")} className={h2PolicyClasses}>Tax Information Disclaimer</h2>
                <div className={proseBlockClasses}>
                  <p>
                    Tax calculations provided on this website are simplified estimates based on general tax brackets and standard deductions. They do not account for:
                  </p>
                  <ul>
                    <li>All possible deductions and credits</li>
                    <li>State and local tax variations</li>
                    <li>Changes in tax laws</li>
                    <li>Alternative Minimum Tax (AMT)</li>
                    <li>Self-employment taxes</li>
                    <li>Complex tax situations</li>
                  </ul>
                  <p>
                    <strong>Always consult with a qualified tax professional for accurate tax advice and filing assistance.</strong>
                  </p>
                </div>
                
                <h2 id={slugify("Investment Information Disclaimer")} className={h2PolicyClasses}>Investment Information Disclaimer</h2>
                <div className={proseBlockClasses}>
                  <p>
                    Any investment-related information provided on this website is for educational purposes only and should not be considered as investment advice or recommendations. Investment decisions should be based on your individual financial situation, goals, and risk tolerance.
                  </p>
                  {/* Using HTML structure for inline intro */}
                  <ul>
                    <li><strong>Key investment disclaimers:</strong></li>
                    <li>Past performance does not guarantee future results</li>
                    <li>All investments carry risk of loss</li>
                    <li>Market conditions can change rapidly</li>
                    <li>Diversification does not guarantee profits or protect against losses</li>
                    <li>Consider all fees and expenses when evaluating investments</li>
                  </ul>
                </div>
                
                <h2 id={slugify("Professional Advice Recommendation")} className={h2PolicyClasses}>Professional Advice Recommendation</h2>
                <div className={proseBlockClasses}>
                  <p>
                    Before making any significant financial decisions, we strongly recommend consulting with qualified professionals:
                  </p>
                  <ul>
                    <li><strong>Financial Advisors:</strong> For comprehensive financial planning and investment advice</li>
                    <li><strong>Tax Professionals:</strong> For tax planning and filing assistance</li>
                    <li><strong>Legal Counsel:</strong> For estate planning and legal matters</li>
                    <li><strong>Insurance Agents:</strong> For insurance needs analysis</li>
                    <li><strong>Mortgage Professionals:</strong> For real estate financing decisions</li>
                  </ul>
                </div>

                <h2 id={slugify("Regional and Legal Variations")} className={h2PolicyClasses}>Regional and Legal Variations</h2>
                <div className={proseBlockClasses}>
                    <p>
                    Financial regulations, tax laws, and practices vary significantly by country, state, and locality. While we attempt to provide information applicable to various regions, our content may not be accurate for all jurisdictions.
                    </p>
                    <p>
                    Users should verify that any financial strategies or calculations are appropriate and legal in their specific location.
                    </p>
                </div>

                <h2 id={slugify("Data Entry and Privacy")} className={h2PolicyClasses}>Data Entry and Privacy</h2>
                <div className={proseBlockClasses}>
                    <p>
                    While our calculators process data locally in your browser and do not store personal financial information on our servers, you should still exercise caution when entering sensitive financial data on any website.
                    </p>
                    <ul>
                        <li><strong>We recommend:</strong></li>
                        <li>Using general estimates rather than exact sensitive amounts when possible</li>
                        <li>Clearing your browser data after using our calculators</li>
                        <li>Not sharing results that contain sensitive personal information</li>
                    </ul>
                </div>
                
                <h2 id={slugify("Limitation of Liability")} className={h2PolicyClasses}>Limitation of Liability</h2>
                <div className={proseBlockClasses}>
                  <p>
                    In no event shall WageCalculator, its owners, employees, or affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:
                  </p>
                  <ul>
                    <li>Use of our calculators or information</li>
                    <li>Errors or omissions in calculations or content</li>
                    <li>Financial decisions based on our content</li>
                    <li>Technical failures or interruptions</li>
                    <li>Third-party actions or content</li>
                  </ul>
                </div>

                <h2 id={slugify("Third-Party Content and Links")} className={h2PolicyClasses}>Third-Party Content and Links</h2>
                <div className={proseBlockClasses}>
                  <p>
                    Our website may contain links to third-party websites or reference third-party information. We do not endorse or assume responsibility for the accuracy, completeness, or reliability of any third-party content.
                  </p>
                </div>

                <h2 id={slugify("Updates and Changes")} className={h2PolicyClasses}>Updates and Changes</h2>
                <div className={proseBlockClasses}>
                  <p>
                    Financial laws, regulations, and best practices change frequently. While we strive to keep our information current, we cannot guarantee that all content reflects the most recent changes.
                  </p>
                  <p>
                    Users should verify that information is current and applicable to their situation before making financial decisions.
                  </p>
                </div>

                <h2 id={slugify("No Guarantees")} className={h2PolicyClasses}>No Guarantees</h2>
                <div className={proseBlockClasses}>
                  <p>
                    WageCalculator makes no guarantees regarding:
                  </p>
                  <ul>
                    <li>The accuracy of calculations or information</li>
                    <li>The suitability of strategies for your situation</li>
                    <li>Financial outcomes from following our content</li>
                    <li>Continuous availability of our services</li>
                    <li>Error-free operation of our calculators</li>
                  </ul>
                </div>

                <h2 id={slugify("Your Responsibility")} className={h2PolicyClasses}>Your Responsibility</h2>
                <div className={proseBlockClasses}>
                  <p>
                    By using WageCalculator, you acknowledge and agree that:
                  </p>
                  <ul>
                    <li>You understand the limitations of our tools and information</li>
                    <li>You will seek professional advice for important financial decisions</li>
                    <li>You will not rely solely on our calculations for financial planning</li>
                    <li>You accept responsibility for verifying information accuracy</li>
                    <li>You understand that financial outcomes may vary from our estimates</li>
                  </ul>
                </div>
                
                {/* Special Reminder Box */}
                <div id={slugify("Final Reminder")} className="mt-12 p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-md scroll-mt-24">
                    <h3 className="text-lg font-bold text-yellow-800 mb-2 flex items-center">
                        <Info size={20} className="mr-2 text-yellow-700" />
                        Final Reminder
                    </h3>
                    <p className="text-yellow-700 leading-relaxed">
                    <strong>This disclaimer does not constitute legal advice.</strong> The specific disclaimers and limitations that apply to your situation may vary based on your location and circumstances. Consult with qualified legal and financial professionals to ensure you have appropriate protections and understand your obligations.
                    </p>
                </div>
              </article>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisclaimerPage;