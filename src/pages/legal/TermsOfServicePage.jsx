import React from 'react';
import SEOHead from '../../components/seo/SEOHead';

const TermsOfServicePage = () => {
  return (
    <>
      <SEOHead 
        title="Terms of Service | WageCalculator"
        description="Read the terms and conditions for using WageCalculator's financial calculator services."
        keywords="terms of service, terms and conditions, user agreement, website terms"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            
            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using WageCalculator ("the Service," "our website," or "the Site"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Description of Service</h2>
              <p className="mb-4">
                WageCalculator provides online financial calculators and educational content to help users make informed financial decisions. Our services include but are not limited to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Salary and wage calculators</li>
                <li>Tax calculators and estimators</li>
                <li>Loan and mortgage calculators</li>
                <li>Retirement and savings calculators</li>
                <li>Currency converters</li>
                <li>Financial guides and educational content</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">User Responsibilities</h2>
              <p className="mb-4">
                By using our Service, you agree to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Provide accurate information when using our calculators</li>
                <li>Use the Service only for lawful purposes</li>
                <li>Not attempt to interfere with or disrupt the Service</li>
                <li>Not use automated systems to access the Service without permission</li>
                <li>Not reproduce, duplicate, copy, sell, or resell any portion of the Service without express written consent</li>
                <li>Respect the intellectual property rights of WageCalculator and third parties</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Accuracy of Information</h2>
              <p className="mb-4">
                While we strive to provide accurate and up-to-date information, WageCalculator makes no warranties about the completeness, reliability, and accuracy of this information. Any action you take upon the information on this website is strictly at your own risk.
              </p>
              <p className="mb-4">
                Our calculators provide estimates based on the information you input and general assumptions. Results should be used as guidelines only and may not reflect actual financial outcomes due to various factors including but not limited to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Changes in tax laws and regulations</li>
                <li>Individual circumstances not accounted for in calculations</li>
                <li>Market fluctuations and economic conditions</li>
                <li>Differences in local regulations and practices</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Financial Disclaimer</h2>
              <p className="mb-4">
                <strong>WageCalculator is not a financial advisor and does not provide financial, investment, tax, or legal advice.</strong> The information and tools provided on this website are for educational and informational purposes only and should not be considered as professional financial advice.
              </p>
              <p className="mb-4">
                You should consult with qualified professionals (financial advisors, tax professionals, attorneys) before making any financial decisions. We strongly recommend that you verify all calculations and seek professional advice for your specific situation.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
              <p className="mb-4">
                To the fullest extent permitted by law, WageCalculator shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Loss of profits, revenue, or business opportunities</li>
                <li>Financial losses resulting from use of our calculators or information</li>
                <li>Errors or omissions in calculations or content</li>
                <li>Interruption or cessation of service</li>
                <li>Data loss or corruption</li>
              </ul>
              <p className="mb-4">
                Your sole remedy for any dispute or dissatisfaction with the Service is to stop using the Service.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Intellectual Property Rights</h2>
              <p className="mb-4">
                All content on WageCalculator, including but not limited to text, graphics, logos, images, software, and calculator algorithms, is the property of WageCalculator or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="mb-4">
                You may not reproduce, distribute, modify, create derivative works from, publicly display, or commercially exploit any content without our express written permission.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Privacy Policy</h2>
              <p className="mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your information.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third-Party Services</h2>
              <p className="mb-4">
                Our website may contain links to third-party websites or services that are not owned or controlled by WageCalculator. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
              </p>
              <p className="mb-4">
                We may use third-party services such as Google Analytics and Google AdSense, which have their own terms of service and privacy policies.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Service Availability</h2>
              <p className="mb-4">
                WageCalculator strives to maintain continuous service availability but does not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time without notice.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Indemnification</h2>
              <p className="mb-4">
                You agree to defend, indemnify, and hold harmless WageCalculator, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your use of the Service or violation of these Terms.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Governing Law</h2>
              <p className="mb-4">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which WageCalculator operates, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the courts of that jurisdiction.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Severability</h2>
              <p className="mb-4">
                If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect, and the invalid or unenforceable provision shall be replaced with a valid and enforceable provision that most closely reflects the original intent.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to Terms</h2>
              <p className="mb-4">
                WageCalculator reserves the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on this page and updating the "Last updated" date. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Termination</h2>
              <p className="mb-4">
                We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <ul className="list-none mb-4 space-y-2">
                <li>Email: legal@wagecalculator.com</li>
                <li>Website: wagecalculator.com/contact</li>
              </ul>
              
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Important Legal Notice:</strong> These terms of service are provided for informational purposes and may not be suitable for all situations. This document does not constitute legal advice. You should consult with a qualified attorney to ensure your terms of service are appropriate for your specific business and comply with applicable laws in your jurisdiction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfServicePage;