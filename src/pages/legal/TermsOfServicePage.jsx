// src/pages/legal/TermsOfServicePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Info, Edit3, Mail, List as ListIcon } from 'lucide-react'; // Using FileText for ToS
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

const TermsOfServicePage = () => {
  const lastUpdatedDate = "October 26, 2023"; // Replace with your actual last updated date
  const navigate = useNavigate();

  // Manually define the Table of Contents for this specific policy
  const policySections = [
    { text: "Acceptance of Terms", id: slugify("Acceptance of Terms") },
    { text: "Description of Service", id: slugify("Description of Service") },
    { text: "User Responsibilities", id: slugify("User Responsibilities") },
    { text: "Accuracy of Information", id: slugify("Accuracy of Information") },
    { text: "Financial Disclaimer", id: slugify("Financial Disclaimer") },
    { text: "Limitation of Liability", id: slugify("Limitation of Liability") },
    { text: "Intellectual Property Rights", id: slugify("Intellectual Property Rights") },
    { text: "Privacy Policy", id: slugify("Privacy Policy") },
    { text: "Third-Party Services", id: slugify("Third-Party Services") },
    { text: "Service Availability", id: slugify("Service Availability") },
    { text: "Indemnification", id: slugify("Indemnification") },
    { text: "Governing Law", id: slugify("Governing Law") },
    { text: "Severability", id: slugify("Severability") },
    { text: "Changes to Terms", id: slugify("Changes to Terms") },
    { text: "Termination", id: slugify("Termination") },
    { text: "Contact Information", id: slugify("Contact Information") },
  ];

  const [activeTocId, setActiveTocId] = useState(policySections[0]?.id || '');
  const contentRef = useRef(null);

  // Intersection Observer logic (same as previous legal pages)
  useEffect(() => {
    if (!policySections.length || !contentRef.current) return;
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

  const h2PolicyClasses = "text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-5 pb-3 border-b border-gray-200 scroll-mt-24";
  // const h3PolicyClasses = "text-xl md:text-2xl font-bold text-gray-800 mt-8 mb-4 scroll-mt-24"; // Not used in current ToS text
  
  const proseBlockClasses = "prose prose-lg max-w-none prose-indigo prose-p:mb-5 prose-p:leading-relaxed prose-ul:list-disc prose-ul:list-inside prose-ul:pl-0 prose-ul:mb-5 prose-li:my-1 prose-li:mb-2 prose-strong:font-semibold hover:prose-a:text-primary-600 prose-a:font-medium hover:prose-a:underline";

  return (
    <>
      <SEOHead 
        title="Terms of Service | WageCalculator"
        description="Read the terms and conditions for using WageCalculator's financial calculator services."
        keywords="terms of service, terms and conditions, user agreement, website terms, legal agreement"
      />

      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 text-white pt-10 pb-12 md:pt-16 md:pb-20 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center bg-white/10 p-4 rounded-full mb-5 shadow-sm backdrop-blur-sm">
              <FileText className="w-10 h-10 text-slate-300" /> {/* Icon for Terms of Service */}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-balance">
              Terms of Service
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Please read these terms carefully before using our services.
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
                    Sections
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
                
                <h2 id={slugify("Acceptance of Terms")} className={h2PolicyClasses}>Acceptance of Terms</h2>
                <div className={proseBlockClasses}>
                  <p>
                    By accessing and using WageCalculator ("the Service," "our website," or "the Site"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>
              
                <h2 id={slugify("Description of Service")} className={h2PolicyClasses}>Description of Service</h2>
                <div className={proseBlockClasses}>
                  <p>
                    WageCalculator provides online financial calculators and educational content to help users make informed financial decisions. Our services include but are not limited to:
                  </p>
                  <ul>
                    <li>Salary and wage calculators</li>
                    <li>Tax calculators and estimators</li>
                    <li>Loan and mortgage calculators</li>
                    <li>Retirement and savings calculators</li>
                    <li>Currency converters</li>
                    <li>Financial guides and educational content</li>
                  </ul>
                </div>
              
                <h2 id={slugify("User Responsibilities")} className={h2PolicyClasses}>User Responsibilities</h2>
                <div className={proseBlockClasses}>
                  <p>
                    By using our Service, you agree to:
                  </p>
                  <ul>
                    <li>Provide accurate information when using our calculators</li>
                    <li>Use the Service only for lawful purposes</li>
                    <li>Not attempt to interfere with or disrupt the Service</li>
                    <li>Not use automated systems to access the Service without permission</li>
                    <li>Not reproduce, duplicate, copy, sell, or resell any portion of the Service without express written consent</li>
                    <li>Respect the intellectual property rights of WageCalculator and third parties</li>
                  </ul>
                </div>
              
                <h2 id={slugify("Accuracy of Information")} className={h2PolicyClasses}>Accuracy of Information</h2>
                <div className={proseBlockClasses}>
                  <p>
                    While we strive to provide accurate and up-to-date information, WageCalculator makes no warranties about the completeness, reliability, and accuracy of this information. Any action you take upon the information on this website is strictly at your own risk.
                  </p>
                  <p>
                    Our calculators provide estimates based on the information you input and general assumptions. Results should be used as guidelines only and may not reflect actual financial outcomes due to various factors including but not limited to:
                  </p>
                  <ul>
                    <li>Changes in tax laws and regulations</li>
                    <li>Individual circumstances not accounted for in calculations</li>
                    <li>Market fluctuations and economic conditions</li>
                    <li>Differences in local regulations and practices</li>
                  </ul>
                </div>
                
                <h2 id={slugify("Financial Disclaimer")} className={h2PolicyClasses}>Financial Disclaimer</h2>
                <div className={proseBlockClasses}>
                  <p>
                    <strong>WageCalculator is not a financial advisor and does not provide financial, investment, tax, or legal advice.</strong> The information and tools provided on this website are for educational and informational purposes only and should not be considered as professional financial advice.
                  </p>
                  <p>
                    You should consult with qualified professionals (financial advisors, tax professionals, attorneys) before making any financial decisions. We strongly recommend that you verify all calculations and seek professional advice for your specific situation.
                  </p>
                </div>
                
                <h2 id={slugify("Limitation of Liability")} className={h2PolicyClasses}>Limitation of Liability</h2>
                <div className={proseBlockClasses}>
                  <p>
                    To the fullest extent permitted by law, WageCalculator shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                  </p>
                  <ul>
                    <li>Loss of profits, revenue, or business opportunities</li>
                    <li>Financial losses resulting from use of our calculators or information</li>
                    <li>Errors or omissions in calculations or content</li>
                    <li>Interruption or cessation of service</li>
                    <li>Data loss or corruption</li>
                  </ul>
                  <p>
                    Your sole remedy for any dispute or dissatisfaction with the Service is to stop using the Service.
                  </p>
                </div>
                
                <h2 id={slugify("Intellectual Property Rights")} className={h2PolicyClasses}>Intellectual Property Rights</h2>
                <div className={proseBlockClasses}>
                  <p>
                    All content on WageCalculator, including but not limited to text, graphics, logos, images, software, and calculator algorithms, is the property of WageCalculator or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
                  </p>
                  <p>
                    You may not reproduce, distribute, modify, create derivative works from, publicly display, or commercially exploit any content without our express written permission.
                  </p>
                </div>
                
                <h2 id={slugify("Privacy Policy")} className={h2PolicyClasses}>Privacy Policy</h2>
                <div className={proseBlockClasses}>
                  <p>
                    Your privacy is important to us. Please review our <Link to="/privacy-policy">Privacy Policy</Link>, which also governs your use of the Service, to understand our practices regarding the collection and use of your information.
                  </p>
                </div>
                
                <h2 id={slugify("Third-Party Services")} className={h2PolicyClasses}>Third-Party Services</h2>
                <div className={proseBlockClasses}>
                  <p>
                    Our website may contain links to third-party websites or services that are not owned or controlled by WageCalculator. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
                  </p>
                  <p>
                    We may use third-party services such as Google Analytics and Google AdSense, which have their own terms of service and privacy policies.
                  </p>
                </div>
                
                <h2 id={slugify("Service Availability")} className={h2PolicyClasses}>Service Availability</h2>
                <div className={proseBlockClasses}>
                  <p>
                    WageCalculator strives to maintain continuous service availability but does not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time without notice.
                  </p>
                </div>
                
                <h2 id={slugify("Indemnification")} className={h2PolicyClasses}>Indemnification</h2>
                <div className={proseBlockClasses}>
                  <p>
                    You agree to defend, indemnify, and hold harmless WageCalculator, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your use of the Service or violation of these Terms.
                  </p>
                </div>
                
                <h2 id={slugify("Governing Law")} className={h2PolicyClasses}>Governing Law</h2>
                <div className={proseBlockClasses}>
                  <p>
                    These Terms shall be interpreted and governed by the laws of the jurisdiction in which WageCalculator operates, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the courts of that jurisdiction.
                  </p>
                </div>
                
                <h2 id={slugify("Severability")} className={h2PolicyClasses}>Severability</h2>
                <div className={proseBlockClasses}>
                  <p>
                    If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect, and the invalid or unenforceable provision shall be replaced with a valid and enforceable provision that most closely reflects the original intent.
                  </p>
                </div>
                
                <h2 id={slugify("Changes to Terms")} className={h2PolicyClasses}>Changes to Terms</h2>
                <div className={proseBlockClasses}>
                  <p>
                    WageCalculator reserves the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on this page and updating the "Last updated" date. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
                  </p>
                </div>
                
                <h2 id={slugify("Termination")} className={h2PolicyClasses}>Termination</h2>
                <div className={proseBlockClasses}>
                  <p>
                    We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
                  </p>
                </div>
                
                <div className="mt-12 p-6 bg-red-50 border-l-4 border-red-500 rounded-r-md text-sm not-prose">
                  <p className="text-red-800 leading-relaxed">
                    <strong>Important Legal Notice:</strong> These terms of service are provided for informational purposes and may not be suitable for all situations. This document does not constitute legal advice. You should consult with a qualified attorney to ensure your terms of service are appropriate for your specific business and comply with applicable laws in your jurisdiction.
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

export default TermsOfServicePage;