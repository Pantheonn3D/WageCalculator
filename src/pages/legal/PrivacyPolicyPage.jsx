import React from 'react';
import SEOHead from '../../components/seo/SEOHead';

const PrivacyPolicyPage = () => {
  return (
    <>
      <SEOHead 
        title="Privacy Policy | WageCalculator"
        description="Learn how WageCalculator collects, uses, and protects your personal information."
        keywords="privacy policy, data protection, personal information, cookies"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            
            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Introduction</h2>
              <p className="mb-4">
                WageCalculator ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our financial calculator services.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Personal Information</h3>
              <p className="mb-4">
                We may collect personal information that you voluntarily provide to us, including but not limited to:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Contact information (email address, name) when you subscribe to our newsletter or contact us</li>
                <li>Demographic information for personalized calculator results</li>
                <li>Financial data entered into our calculators (processed locally and not stored)</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Automatically Collected Information</h3>
              <p className="mb-4">
                When you visit our website, we automatically collect certain information, including:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>IP address and approximate location (for currency and tax localization)</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Referring website</li>
                <li>Pages viewed and time spent on our site</li>
                <li>Device information and screen resolution</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Cookies and Tracking Technologies</h3>
              <p className="mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our website. This includes:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Essential cookies for website functionality</li>
                <li>Preference cookies to remember your calculator settings</li>
                <li>Analytics cookies to understand how visitors use our site</li>
                <li>Advertising cookies from Google AdSense and other advertising partners</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
              <p className="mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>To provide and maintain our financial calculator services</li>
                <li>To personalize your experience based on your location and preferences</li>
                <li>To improve our website and services</li>
                <li>To analyze usage patterns and trends</li>
                <li>To send newsletters and updates (with your consent)</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To detect and prevent fraud or abuse</li>
                <li>To comply with legal obligations</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information Sharing and Disclosure</h2>
              <p className="mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website (hosting, analytics, advertising)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale, or transfer of our business assets</li>
                <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third-Party Services</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Google Services</h3>
              <p className="mb-4">
                Our website uses Google services, including:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li><strong>Google Analytics:</strong> To understand website usage and improve our services</li>
                <li><strong>Google AdSense:</strong> To display relevant advertisements</li>
                <li>These services may collect and use data according to their own privacy policies</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">IP Geolocation</h3>
              <p className="mb-4">
                We use IP geolocation services (such as ipapi.co) to determine your approximate location for providing localized currency and tax information. This helps us customize calculator results for your region.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Retention</h2>
              <p className="mb-4">
                We retain personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Financial data entered into our calculators is processed locally in your browser and is not stored on our servers.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Rights and Choices</h2>
              <p className="mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your information in a portable format</li>
                <li><strong>Objection:</strong> Object to certain processing of your information</li>
                <li><strong>Cookie Management:</strong> Control cookies through your browser settings</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Children's Privacy</h2>
              <p className="mb-4">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">International Data Transfers</h2>
              <p className="mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after any changes constitutes acceptance of the updated policy.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <ul className="list-none mb-4 space-y-2">
                <li>Email: privacy@wagecalculator.com</li>
                <li>Website: wagecalculator.com/contact</li>
              </ul>
              
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Disclaimer:</strong> This privacy policy is provided for informational purposes and is not legal advice. You should consult with a qualified attorney for legal guidance specific to your situation and jurisdiction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;