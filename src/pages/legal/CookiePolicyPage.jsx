import React from 'react';
import SEOHead from '../../components/seo/SEOHead';

const CookiePolicyPage = () => {
  return (
    <>
      <SEOHead 
        title="Cookie Policy | WageCalculator"
        description="Learn about how WageCalculator uses cookies and how you can manage your cookie preferences."
        keywords="cookie policy, cookies, tracking, web analytics, privacy"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
            
            <p className="text-gray-600 mb-8">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Are Cookies?</h2>
              <p className="mb-4">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners about how users interact with their sites.
              </p>
              <p className="mb-4">
                Cookies enable websites to remember your preferences, improve your browsing experience, and provide personalized content and advertisements.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Cookies</h2>
              <p className="mb-4">
                WageCalculator uses cookies to enhance your experience on our website and to help us understand how our site is used. We use cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>To remember your preferences and settings</li>
                <li>To analyze website traffic and user behavior</li>
                <li>To provide personalized content and advertisements</li>
                <li>To improve our website functionality and performance</li>
                <li>To ensure website security and prevent fraud</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Essential Cookies</h3>
              <p className="mb-4">
                These cookies are necessary for our website to function properly and cannot be disabled in our systems. They are usually set in response to actions you take, such as setting your privacy preferences, logging in, or filling in forms.
              </p>
              <p className="mb-4">
                <strong>Examples:</strong>
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Session management cookies</li>
                <li>Security cookies</li>
                <li>Load balancing cookies</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Preference Cookies</h3>
              <p className="mb-4">
                These cookies allow our website to remember information that changes the way the site behaves or looks, such as your preferred language, region, or currency settings for our calculators.
              </p>
              <p className="mb-4">
                <strong>Examples:</strong>
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Language and region preferences</li>
                <li>Calculator input preferences</li>
                <li>Display settings</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Analytics Cookies</h3>
              <p className="mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This data helps us improve our website and services.
              </p>
              <p className="mb-4">
                <strong>We use Google Analytics, which may set the following cookies:</strong>
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li><code>_ga</code> - Distinguishes unique users</li>
                <li><code>_ga_*</code> - Used to maintain session state</li>
                <li><code>_gid</code> - Distinguishes unique users</li>
                <li><code>_gat</code> - Used to throttle request rate</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Advertising Cookies</h3>
              <p className="mb-4">
                These cookies are used to make advertising messages more relevant to you. They prevent the same ad from continuously reappearing, ensure that ads are properly displayed, and in some cases select advertisements based on your interests.
              </p>
              <p className="mb-4">
                <strong>We use Google AdSense, which may set cookies for:</strong>
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li>Displaying relevant advertisements</li>
                <li>Frequency capping</li>
                <li>Measuring ad effectiveness</li>
                <li>Personalized advertising (if you have opted in)</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third-Party Cookies</h2>
              <p className="mb-4">
                Some cookies on our website are set by third-party services that appear on our pages. We do not control these cookies, and they are governed by the privacy policies of the respective third parties.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Google Services</h3>
              <p className="mb-4">
                We use several Google services that may set cookies:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Google AdSense:</strong> For displaying advertisements</li>
                <li><strong>Google Fonts:</strong> For loading web fonts (may set performance cookies)</li>
              </ul>
              <p className="mb-4">
                You can learn more about Google's cookie usage in their <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookie Duration</h2>
              <p className="mb-4">
                Cookies can be either "session" cookies or "persistent" cookies:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li><strong>Session Cookies:</strong> Temporary cookies that are deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a specified period or until manually deleted</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Managing Your Cookie Preferences</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Browser Settings</h3>
              <p className="mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>View which cookies are stored on your device</li>
                <li>Delete existing cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies (this may affect website functionality)</li>
                <li>Set your browser to notify you when cookies are being set</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Browser-Specific Instructions</h3>
              <p className="mb-4">
                Here are links to cookie management instructions for popular browsers:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Internet Explorer</a></li>
                <li><a href="https://support.microsoft.com/en-us/help/4027947/microsoft-edge-delete-cookies" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Microsoft Edge</a></li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Opt-Out Tools</h3>
              <p className="mb-4">
                You can also use these tools to manage advertising cookies:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-1">
                <li><a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Google Ad Settings</a></li>
                <li><a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Digital Advertising Alliance</a></li>
                <li><a href="http://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Your Online Choices</a></li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Impact of Disabling Cookies</h2>
              <p className="mb-4">
                While you can disable cookies, please note that doing so may affect your experience on our website:
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>Some features may not work properly</li>
                <li>You may need to re-enter preferences each time you visit</li>
                <li>Calculators may not remember your input preferences</li>
                <li>You may see less relevant advertisements</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Updates to This Cookie Policy</h2>
              <p className="mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page.
              </p>
              
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
              </p>
              <ul className="list-none mb-4 space-y-2">
                <li>Email: privacy@wagecalculator.com</li>
                <li>Website: wagecalculator.com/contact</li>
              </ul>
              
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This cookie policy is provided for informational purposes and may not address all aspects of cookie usage specific to your jurisdiction. You should consult with a qualified attorney or privacy professional to ensure compliance with applicable laws and regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicyPage;