// src/pages/legal/CookiePolicyPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Info, Edit3, Mail, List as ListIcon } from 'lucide-react';
import SEOHead from '../../components/seo/SEOHead';

// Helper function to generate slugs for heading IDs
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -

const CookiePolicyPage = () => {
  const lastUpdatedDate = "October 26, 2023"; // Replace with your actual last updated date
  const navigate = useNavigate();

  // Manually define the Table of Contents for this specific policy
  const policySections = [
    { text: "What Are Cookies?", id: slugify("What Are Cookies?") },
    { text: "How We Use Cookies", id: slugify("How We Use Cookies") },
    { text: "Types of Cookies We Use", id: slugify("Types of Cookies We Use") },
    // Optional: Add H3s here if you want a more granular ToC
    // { text: "Essential Cookies", id: slugify("Essential Cookies"), level: 3 }, 
    { text: "Third-Party Cookies", id: slugify("Third-Party Cookies") },
    { text: "Cookie Duration", id: slugify("Cookie Duration") },
    { text: "Managing Your Cookie Preferences", id: slugify("Managing Your Cookie Preferences") },
    { text: "Impact of Disabling Cookies", id: slugify("Impact of Disabling Cookies") },
    { text: "Updates to This Cookie Policy", id: slugify("Updates to This Cookie Policy") },
    { text: "Contact Us", id: slugify("Contact Us") },
  ];

  const [activeTocId, setActiveTocId] = useState(policySections[0]?.id || '');
  const contentRef = useRef(null);

  // Intersection Observer for highlighting active ToC item
  useEffect(() => {
    if (!policySections.length || !contentRef.current) return;

    const observerCallback = (entries) => {
      let currentActive = activeTocId; // Keep current active if nothing new is predominantly visible
      let highestIntersectionRatio = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.intersectionRatio > highestIntersectionRatio) {
            highestIntersectionRatio = entry.intersectionRatio;
            currentActive = entry.target.id;
          }
        }
      });
      
      // If highestIntersectionRatio is very low, it means we might be between sections
      // or only a tiny bit is visible. In such cases, we might prefer to find the
      // "most visible" even if its ratio isn't > 0.5, or stick to the last active.
      // This logic tries to find the topmost visible section if multiple are partially visible.
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
      rootMargin: '-20% 0px -70% 0px', // Viewport area to consider: top 20% to bottom 30%
      threshold: [0, 0.1, 0.5, 1.0], // Trigger callback at these visibility percentages
    });

    const elements = policySections.map(item => document.getElementById(item.id)).filter(Boolean);
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => { if (el) observer.unobserve(el); });
  }, [policySections, activeTocId]); // Added activeTocId to dependencies for potential refinement if needed

  // Define explicit heading classes
  const h2PolicyClasses = "text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-5 pb-3 border-b border-gray-200 scroll-mt-24";
  const h3PolicyClasses = "text-xl md:text-2xl font-bold text-gray-800 mt-8 mb-4 scroll-mt-24";
  
  // Common prose classes for content blocks between headings
  const proseBlockClasses = "prose prose-lg max-w-none prose-indigo prose-p:mb-5 prose-p:leading-relaxed prose-ul:list-disc prose-ul:list-inside prose-ul:pl-0 prose-ul:mb-5 prose-li:my-1 prose-li:mb-2 prose-strong:font-semibold hover:prose-a:text-primary-600 prose-a:font-medium hover:prose-a:underline";

  return (
    <>
      <SEOHead
        title="Cookie Policy | WageCalculator"
        description="Learn about how WageCalculator uses cookies and how you can manage your cookie preferences."
        keywords="cookie policy, cookies, tracking, web analytics, privacy, user data"
      />

      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 text-white pt-10 pb-12 md:pt-16 md:pb-20 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center bg-white/10 p-4 rounded-full mb-5 shadow-sm backdrop-blur-sm">
              <ShieldCheck className="w-10 h-10 text-slate-300" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-balance">
              Cookie Policy
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Understanding how we use cookies to enhance your experience on WageCalculator.
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
                
                <h2 id={slugify("What Are Cookies?")} className={h2PolicyClasses}>What Are Cookies?</h2>
                <div className={proseBlockClasses}>
                  <p>
                    Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners about how users interact with their sites.
                  </p>
                  <p>
                    Cookies enable websites to remember your preferences, improve your browsing experience, and provide personalized content and advertisements.
                  </p>
                </div>
                
                <h2 id={slugify("How We Use Cookies")} className={h2PolicyClasses}>How We Use Cookies</h2>
                <div className={proseBlockClasses}>
                  <p>
                    WageCalculator uses cookies to enhance your experience on our website and to help us understand how our site is used. We use cookies for the following purposes:
                  </p>
                  <ul>
                    <li>To remember your preferences and settings (e.g., region, currency).</li>
                    <li>To analyze website traffic and user behavior for site improvement.</li>
                    <li>To provide relevant content and advertisements (where applicable).</li>
                    <li>To improve our website functionality and performance.</li>
                    <li>To ensure website security and prevent fraudulent activity.</li>
                  </ul>
                </div>
                
                <h2 id={slugify("Types of Cookies We Use")} className={h2PolicyClasses}>Types of Cookies We Use</h2>
                <div className={proseBlockClasses}>
                  <h3 id={slugify("Essential Cookies")} className={h3PolicyClasses}>Essential Cookies</h3>
                  <p>
                    These cookies are necessary for our website to function properly and cannot be disabled in our systems. They are usually set in response to actions you take, such as setting your privacy preferences, logging in, or filling in forms. Without these cookies, services you have asked for cannot be provided.
                  </p>
                  <ul>
                    <li><strong>Examples:</strong> Session management cookies, security cookies for authentication, load balancing cookies.</li>
                  </ul>
                  
                  <h3 id={slugify("Preference Cookies (Functional Cookies)")} className={h3PolicyClasses}>Preference Cookies (Functional Cookies)</h3>
                  <p>
                    These cookies allow our website to remember information that changes the way the site behaves or looks, such as your preferred language, region, or currency settings for our calculators. They enhance functionality and personalization.
                  </p>
                  <ul>
                    <li><strong>Examples:</strong> Language and region preferences, calculator input preferences, display settings.</li>
                  </ul>
                  
                  <h3 id={slugify("Analytics Cookies (Performance Cookies)")} className={h3PolicyClasses}>Analytics Cookies (Performance Cookies)</h3>
                  <p>
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This data helps us improve our website and services by identifying popular pages, user journeys, and potential issues.
                  </p>
                  <ul>
                    <li><strong>We use Google Analytics, which may set cookies like:</strong></li>
                    <li><code>_ga</code>, <code>_gid</code>: To distinguish unique users.</li>
                    <li><code>_ga_*</code>: To persist session state.</li>
                    <li><code>_gat</code>: To throttle request rate.</li>
                  </ul>
                  
                  <h3 id={slugify("Advertising Cookies (Targeting Cookies)")} className={h3PolicyClasses}>Advertising Cookies (Targeting Cookies)</h3>
                  <p>
                    These cookies may be set through our site by our advertising partners (e.g., Google AdSense). They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites. They do not store directly personal information but are based on uniquely identifying your browser and internet device. If you do not allow these cookies, you will experience less targeted advertising.
                  </p>
                  <ul>
                    <li><strong>We may use Google AdSense, which can set cookies for:</strong></li>
                    <li>Displaying relevant advertisements based on content or general location.</li>
                    <li>Frequency capping (limiting how often you see an ad).</li>
                    <li>Measuring ad effectiveness.</li>
                    <li>Personalized advertising (only if you have explicitly consented where required by law).</li>
                  </ul>
                </div>

                <h2 id={slugify("Third-Party Cookies")} className={h2PolicyClasses}>Third-Party Cookies</h2>
                <div className={proseBlockClasses}>
                  <p>
                    Some cookies on our website are set by third-party services that appear on our pages. We do not control these cookies, and they are governed by the privacy policies of the respective third parties. These third parties may use cookies to collect information about your online activities over time and across different websites when you use our site.
                  </p>
                  <h3 id={slugify("Google Services")} className={h3PolicyClasses}>Google Services</h3>
                  <p>
                    We use several Google services that may set cookies:
                  </p>
                  <ul>
                    <li><strong>Google Analytics:</strong> For website analytics and performance monitoring.</li>
                    <li><strong>Google AdSense:</strong> For displaying advertisements.</li>
                    <li><strong>Google Fonts:</strong> For loading web fonts. While Google states that requests to the Google Fonts API do not set cookies, it's good practice to be aware of all third-party integrations.</li>
                  </ul>
                  <p>
                    You can learn more about Google's cookie usage and how to manage your preferences in their <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">Cookie Policy</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                  </p>
                </div>
                
                <h2 id={slugify("Cookie Duration")} className={h2PolicyClasses}>Cookie Duration</h2>
                <div className={proseBlockClasses}>
                    <p>
                    Cookies can be either "session" cookies or "persistent" cookies:
                    </p>
                    <ul>
                    <li><strong>Session Cookies:</strong> These are temporary cookies that are deleted when you close your browser. They are used to remember your actions during a single browsing session.</li>
                    <li><strong>Persistent Cookies:</strong> These remain on your device for a specified period (as defined in the cookie itself) or until you manually delete them. They help us recognize you as a returning visitor and remember your preferences.</li>
                    </ul>
                </div>

                <h2 id={slugify("Managing Your Cookie Preferences")} className={h2PolicyClasses}>Managing Your Cookie Preferences</h2>
                <div className={proseBlockClasses}>
                    <p>
                    You have several options for controlling or limiting how we and third parties use cookies:
                    </p>
                    <h3 id={slugify("Our Cookie Consent Tool")} className={h3PolicyClasses}>Our Cookie Consent Tool</h3>
                    <p>
                    When you first visit our website, you may be presented with a cookie consent banner or tool. This tool allows you to customize your cookie preferences for non-essential cookies. Your preferences will be remembered for future visits, but you can typically change them at any time by accessing the cookie settings link (often found in the website footer).
                    </p>
                    <h3 id={slugify("Browser Settings")} className={h3PolicyClasses}>Browser Settings</h3>
                    <p>
                    Most web browsers allow you to control cookies through their settings. You can typically:
                    </p>
                    <ul>
                    <li>View which cookies are stored on your device and delete them individually.</li>
                    <li>Block cookies from specific websites or all third-party cookies.</li>
                    <li>Block all cookies (though this may significantly affect website functionality).</li>
                    <li>Set your browser to notify you when cookies are being set or updated.</li>
                    </ul>
                    <h3 id={slugify("Browser-Specific Instructions")} className={h3PolicyClasses}>Browser-Specific Instructions:</h3>
                    <p>
                    Find out how to manage cookies on popular browsers:
                    </p>
                    <ul>
                    <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                    <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                    <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
                    <li><a href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                    </ul>
                    <h3 id={slugify("Industry Opt-Out Tools")} className={h3PolicyClasses}>Industry Opt-Out Tools</h3>
                    <p>
                    For advertising cookies, you can also use industry opt-out tools:
                    </p>
                    <ul>
                    <li><a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ad Settings</a> (to opt out of personalized ads from Google).</li>
                    <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance (DAA) Opt-Out Tool</a> (for US users).</li>
                    <li><a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer">Your Online Choices (EDAA)</a> (for EU users).</li>
                    </ul>
                    <p>
                        Please note that opting out of interest-based advertising does not mean you will no longer see advertising online. It means that the company or companies from which you opt out will no longer show ads that have been tailored to your interests.
                    </p>
                </div>

                <h2 id={slugify("Impact of Disabling Cookies")} className={h2PolicyClasses}>Impact of Disabling Cookies</h2>
                <div className={proseBlockClasses}>
                    <p>
                    If you choose to disable or block certain cookies, please note that this may affect your experience on our website:
                    </p>
                    <ul>
                    <li>Some features, such as saving calculator inputs or regional preferences, may not work properly.</li>
                    <li>You may need to re-enter preferences each time you visit.</li>
                    <li>The functionality of certain parts of our website may be impaired.</li>
                    <li>While you may still see advertisements, they might be less relevant to your interests.</li>
                    </ul>
                </div>

                <h2 id={slugify("Updates to This Cookie Policy")} className={h2PolicyClasses}>Updates to This Cookie Policy</h2>
                <div className={proseBlockClasses}>
                    <p>
                    We may update this Cookie Policy from time to time to reflect changes in our practices, technology, legal requirements, or for other operational reasons. We encourage you to review this policy periodically to stay informed about how we use cookies. The "Last updated" date at the top of this policy indicates when it was last revised.
                    </p>
                </div>
                
                <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-md text-sm not-prose"> {/* Increased padding for the note */}
                  <p className="text-blue-800 leading-relaxed"> {/* Increased leading for readability */}
                    <strong>Important Note:</strong> This cookie policy is provided for general informational purposes and aims to be comprehensive. However, cookie technologies and regulations are constantly evolving. For specific legal advice regarding compliance with cookie laws applicable to your jurisdiction or business, you should consult with a qualified legal professional specializing in privacy law.
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

export default CookiePolicyPage;