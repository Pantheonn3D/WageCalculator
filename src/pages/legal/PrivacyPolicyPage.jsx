// src/pages/legal/PrivacyPolicyPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Info, Edit3, Mail, List as ListIcon } from 'lucide-react'; // Using Lock for Privacy
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

const PrivacyPolicyPage = () => {
  const lastUpdatedDate = "October 26, 2023"; // Replace with your actual last updated date
  const navigate = useNavigate();

  // Manually define the Table of Contents for this specific policy
  const policySections = [
    { text: "Introduction", id: slugify("Introduction") },
    { text: "Information We Collect", id: slugify("Information We Collect") },
    // Optional: Add H3s for sub-navigation if desired
    // { text: "Personal Information", id: slugify("Personal Information"), level: 3 },
    // { text: "Automatically Collected Information", id: slugify("Automatically Collected Information"), level: 3 },
    // { text: "Cookies and Tracking Technologies", id: slugify("Cookies and Tracking Technologies"), level: 3 },
    { text: "How We Use Your Information", id: slugify("How We Use Your Information") },
    { text: "Information Sharing and Disclosure", id: slugify("Information Sharing and Disclosure") },
    { text: "Third-Party Services", id: slugify("Third-Party Services") },
    { text: "Data Security", id: slugify("Data Security") },
    { text: "Data Retention", id: slugify("Data Retention") },
    { text: "Your Rights and Choices", id: slugify("Your Rights and Choices") },
    { text: "Children's Privacy", id: slugify("Children's Privacy") },
    { text: "International Data Transfers", id: slugify("International Data Transfers") },
    { text: "Changes to This Privacy Policy", id: slugify("Changes to This Privacy Policy") },
    { text: "Contact Us", id: slugify("Contact Us") },
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
  const h3PolicyClasses = "text-xl md:text-2xl font-bold text-gray-800 mt-8 mb-4 scroll-mt-24"; 
  
  const proseBlockClasses = "prose prose-lg max-w-none prose-indigo prose-p:mb-5 prose-p:leading-relaxed prose-ul:list-disc prose-ul:list-inside prose-ul:pl-0 prose-ul:mb-5 prose-li:my-1 prose-li:mb-2 prose-strong:font-semibold hover:prose-a:text-primary-600 prose-a:font-medium hover:prose-a:underline";

  return (
    <>
      <SEOHead 
        title="Privacy Policy | WageCalculator"
        description="Learn how WageCalculator collects, uses, and protects your personal information."
        keywords="privacy policy, data protection, personal information, user data, GDPR, CCPA"
      />

      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 text-white pt-10 pb-12 md:pt-16 md:pb-20 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center bg-white/10 p-4 rounded-full mb-5 shadow-sm backdrop-blur-sm">
              <Lock className="w-10 h-10 text-slate-300" /> {/* Icon for Privacy Policy */}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-balance">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we handle your personal data.
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
                    Policy Sections
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
                
                <h2 id={slugify("Introduction")} className={h2PolicyClasses}>Introduction</h2>
                <div className={proseBlockClasses}>
                  <p>
                    WageCalculator ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our financial calculator services.
                  </p>
                </div>
              
                <h2 id={slugify("Information We Collect")} className={h2PolicyClasses}>Information We Collect</h2>
                <div className={proseBlockClasses}>
                  <h3 id={slugify("Personal Information")} className={h3PolicyClasses}>Personal Information</h3>
                  <p>
                    We may collect personal information that you voluntarily provide to us, including but not limited to:
                  </p>
                  <ul>
                    <li>Contact information (email address, name) when you subscribe to our newsletter or contact us</li>
                    <li>Demographic information for personalized calculator results</li>
                    <li>Financial data entered into our calculators (processed locally and not stored)</li>
                  </ul>
                  
                  <h3 id={slugify("Automatically Collected Information")} className={h3PolicyClasses}>Automatically Collected Information</h3>
                  <p>
                    When you visit our website, we automatically collect certain information, including:
                  </p>
                  <ul>
                    <li>IP address and approximate location (for currency and tax localization)</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Referring website</li>
                    <li>Pages viewed and time spent on our site</li>
                    <li>Device information and screen resolution</li>
                  </ul>
                  
                  <h3 id={slugify("Cookies and Tracking Technologies")} className={h3PolicyClasses}>Cookies and Tracking Technologies</h3>
                  <p>
                    We use cookies and similar tracking technologies to enhance your experience on our website. This includes:
                  </p>
                  <ul>
                    <li>Essential cookies for website functionality</li>
                    <li>Preference cookies to remember your calculator settings</li>
                    <li>Analytics cookies to understand how visitors use our site</li>
                    <li>Advertising cookies from Google AdSense and other advertising partners</li>
                  </ul>
                </div>
              
                <h2 id={slugify("How We Use Your Information")} className={h2PolicyClasses}>How We Use Your Information</h2>
                <div className={proseBlockClasses}>
                  <p>
                    We use the information we collect for the following purposes:
                  </p>
                  <ul>
                    <li>To provide and maintain our financial calculator services</li>
                    <li>To personalize your experience based on your location and preferences</li>
                    <li>To improve our website and services</li>
                    <li>To analyze usage patterns and trends</li>
                    <li>To send newsletters and updates (with your consent)</li>
                    <li>To respond to your inquiries and provide customer support</li>
                    <li>To detect and prevent fraud or abuse</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </div>
              
                <h2 id={slugify("Information Sharing and Disclosure")} className={h2PolicyClasses}>Information Sharing and Disclosure</h2>
                <div className={proseBlockClasses}>
                  <p>
                    We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
                  </p>
                  <ul>
                    <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website (hosting, analytics, advertising)</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                    <li><strong>Business Transfers:</strong> In connection with any merger, sale, or transfer of our business assets</li>
                    <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                  </ul>
                </div>
              
                <h2 id={slugify("Third-Party Services")} className={h2PolicyClasses}>Third-Party Services</h2>
                <div className={proseBlockClasses}>
                  <h3 id={slugify("Google Services")} className={h3PolicyClasses}>Google Services</h3>
                  <p>
                    Our website uses Google services, including:
                  </p>
                  <ul>
                    <li><strong>Google Analytics:</strong> To understand website usage and improve our services</li>
                    <li><strong>Google AdSense:</strong> To display relevant advertisements</li>
                    <li>These services may collect and use data according to their own privacy policies</li>
                  </ul>
                  
                  <h3 id={slugify("IP Geolocation")} className={h3PolicyClasses}>IP Geolocation</h3>
                  <p>
                    We use IP geolocation services (such as ipapi.co) to determine your approximate location for providing localized currency and tax information. This helps us customize calculator results for your region.
                  </p>
                </div>
              
                <h2 id={slugify("Data Security")} className={h2PolicyClasses}>Data Security</h2>
                <div className={proseBlockClasses}>
                  <p>
                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
                  </p>
                </div>
              
                <h2 id={slugify("Data Retention")} className={h2PolicyClasses}>Data Retention</h2>
                <div className={proseBlockClasses}>
                  <p>
                    We retain personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Financial data entered into our calculators is processed locally in your browser and is not stored on our servers.
                  </p>
                </div>
              
                <h2 id={slugify("Your Rights and Choices")} className={h2PolicyClasses}>Your Rights and Choices</h2>
                <div className={proseBlockClasses}>
                  <p>
                    Depending on your location, you may have the following rights regarding your personal information:
                  </p>
                  <ul>
                    <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Portability:</strong> Request a copy of your information in a portable format</li>
                    <li><strong>Objection:</strong> Object to certain processing of your information</li>
                    <li><strong>Cookie Management:</strong> Control cookies through your browser settings</li>
                  </ul>
                </div>
              
                <h2 id={slugify("Children's Privacy")} className={h2PolicyClasses}>Children's Privacy</h2>
                <div className={proseBlockClasses}>
                  <p>
                    Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                  </p>
                </div>
              
                <h2 id={slugify("International Data Transfers")} className={h2PolicyClasses}>International Data Transfers</h2>
                <div className={proseBlockClasses}>
                  <p>
                    Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
                  </p>
                </div>
              
                <h2 id={slugify("Changes to This Privacy Policy")} className={h2PolicyClasses}>Changes to This Privacy Policy</h2>
                <div className={proseBlockClasses}>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of our services after any changes constitutes acceptance of the updated policy.
                  </p>
                </div>
                
                <div className="mt-12 p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-md text-sm not-prose">
                  <p className="text-yellow-800 leading-relaxed">
                    <strong>Disclaimer:</strong> This privacy policy is provided for informational purposes and is not legal advice. You should consult with a qualified attorney for legal guidance specific to your situation and jurisdiction.
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

export default PrivacyPolicyPage;