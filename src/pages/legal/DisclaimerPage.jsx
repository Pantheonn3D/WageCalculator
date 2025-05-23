import React from 'react';
import SEOHead from '../../components/seo/SEOHead';

const DisclaimerPage = () => {
  return (
    <>
      <SEOHead 
        title="Disclaimer | WageCalculator"
        description="Important disclaimers about the financial information and calculator results provided by WageCalculator."
        keywords="disclaimer, financial disclaimer, calculator accuracy, financial advice"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Disclaimer</h1>
            
            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
                <h2 className="text-xl font-bold text-red-900 mb-3">Important Notice</h2>
                <p className="text-red-800 font-medium">
                  WageCalculator is not a financial advisor and does not provide financial, investment, tax, or legal advice. The information and tools provided on this website are for educational and informational purposes only.
                </p>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">General Disclaimer</h2>
              <p className="mb-4">
                The information contained on WageCalculator and its related calculators, guides, and content is provided on an "as is" basis. While we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Financial Information Disclaimer</h2>
              <p className="mb-4">
                <strong>The financial information, calculations, and guidance provided on this website are for educational purposes only and should not be considered as professional financial advice.</strong>
              </p>
              <p className="mb-4">
                All financial calculations are estimates based on the information you provide and general assumptions. These calculations should be used as guidelines only and may not reflect actual results due to various factors including but not limited to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Changes in tax laws, regulations, and rates</li>
                <li>Individual circumstances not accounted for in our calculations</li>
                <li>Market conditions and economic fluctuations</li>
                <li>Differences in local, state, and federal regulations</li>
                <li>Employer-specific policies and benefit structures</li>
                <li>Personal financial situations and goals</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Calculator Accuracy Disclaimer</h2>
              <p className="mb-4">
                Our financial calculators use standard formulas and assumptions that may not apply to every situation. Results should be considered estimates only. We strongly recommend that you:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Verify all calculations independently</li>
                <li>Consult with qualified financial professionals</li>
                <li>Consider your specific circumstances and goals</li>
                <li>Understand the limitations and assumptions of each calculator</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tax Information Disclaimer</h2>
              <p className="mb-4">
                Tax calculations provided on this website are simplified estimates based on general tax brackets and standard deductions. They do not account for:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>All possible deductions and credits</li>
                <li>State and local tax variations</li>
                <li>Changes in tax laws</li>
                <li>Alternative Minimum Tax (AMT)</li>
                <li>Self-employment taxes</li>
                <li>Complex tax situations</li>
              </ul>
              <p className="mb-4">
                <strong>Always consult with a qualified tax professional for accurate tax advice and filing assistance.</strong>
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Investment Information Disclaimer</h2>
              <p className="mb-4">
                Any investment-related information provided on this website is for educational purposes only and should not be considered as investment advice or recommendations. Investment decisions should be based on your individual financial situation, goals, and risk tolerance.
              </p>
              <p className="mb-4">
                <strong>Key investment disclaimers:</strong>
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Past performance does not guarantee future results</li>
                <li>All investments carry risk of loss</li>
                <li>Market conditions can change rapidly</li>
                <li>Diversification does not guarantee profits or protect against losses</li>
                <li>Consider all fees and expenses when evaluating investments</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Professional Advice Recommendation</h2>
              <p className="mb-4">
                Before making any significant financial decisions, we strongly recommend consulting with qualified professionals:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li><strong>Financial Advisors:</strong> For comprehensive financial planning and investment advice</li>
                <li><strong>Tax Professionals:</strong> For tax planning and filing assistance</li>
                <li><strong>Legal Counsel:</strong> For estate planning and legal matters</li>
                <li><strong>Insurance Agents:</strong> For insurance needs analysis</li>
                <li><strong>Mortgage Professionals:</strong> For real estate financing decisions</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Regional and Legal Variations</h2>
              <p className="mb-4">
                Financial regulations, tax laws, and practices vary significantly by country, state, and locality. While we attempt to provide information applicable to various regions, our content may not be accurate for all jurisdictions.
              </p>
              <p className="mb-4">
                Users should verify that any financial strategies or calculations are appropriate and legal in their specific location.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Entry and Privacy</h2>
              <p className="mb-4">
                While our calculators process data locally in your browser and do not store personal financial information on our servers, you should still exercise caution when entering sensitive financial data on any website.
              </p>
              <p className="mb-4">
                <strong>We recommend:</strong>
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Using general estimates rather than exact sensitive amounts when possible</li>
                <li>Clearing your browser data after using our calculators</li>
                <li>Not sharing results that contain sensitive personal information</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
              <p className="mb-4">
                In no event shall WageCalculator, its owners, employees, or affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Use of our calculators or information</li>
                <li>Errors or omissions in calculations or content</li>
                <li>Financial decisions based on our content</li>
                <li>Technical failures or interruptions</li>
                <li>Third-party actions or content</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third-Party Content and Links</h2>
              <p className="mb-4">
                Our website may contain links to third-party websites or reference third-party information. We do not endorse or assume responsibility for the accuracy, completeness, or reliability of any third-party content.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Updates and Changes</h2>
              <p className="mb-4">
                Financial laws, regulations, and best practices change frequently. While we strive to keep our information current, we cannot guarantee that all content reflects the most recent changes.
              </p>
              <p className="mb-4">
                Users should verify that information is current and applicable to their situation before making financial decisions.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">No Guarantees</h2>
              <p className="mb-4">
                WageCalculator makes no guarantees regarding:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>The accuracy of calculations or information</li>
                <li>The suitability of strategies for your situation</li>
                <li>Financial outcomes from following our content</li>
                <li>Continuous availability of our services</li>
                <li>Error-free operation of our calculators</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Responsibility</h2>
              <p className="mb-4">
                By using WageCalculator, you acknowledge and agree that:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>You understand the limitations of our tools and information</li>
                <li>You will seek professional advice for important financial decisions</li>
                <li>You will not rely solely on our calculations for financial planning</li>
                <li>You accept responsibility for verifying information accuracy</li>
                <li>You understand that financial outcomes may vary from our estimates</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Information</h2>
              <p className="mb-4">
                If you have questions about this disclaimer or our services, please contact us at:
              </p>
              <ul className="list-none mb-4 space-y-2">
                <li>Email: support@wagecalculator.com</li>
                <li>Website: wagecalculator.com/contact</li>
              </ul>
              
              <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-bold text-yellow-900 mb-3">Final Reminder</h3>
                <p className="text-yellow-800">
                  <strong>This disclaimer does not constitute legal advice.</strong> The specific disclaimers and limitations that apply to your situation may vary based on your location and circumstances. Consult with qualified legal and financial professionals to ensure you have appropriate protections and understand your obligations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisclaimerPage;