// src/pages/GuideDetailPage.jsx
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Tag,
  BookOpen as NotFoundIcon,
  List,
  Twitter,
  Linkedin,
  Facebook,
  Copy,
  CheckCircle,
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { guideArticles } from '../data/guideArticles'; // Your main data source

// This categories array is from your FinancialGuides.jsx.
// Ideally, this would be in a shared data file.
const categories = [
  { id: 'all', name: 'All Guides' },
  { id: 'income', name: 'Income & Salary' },
  { id: 'planning', name: 'Financial Planning' },
  { id: 'debt', name: 'Debt Management' },
  { id: 'investing', name: 'Investing' },
  { id: 'protection', name: 'Insurance' },
  { id: 'housing', name: 'Housing' },
  { id: 'taxes', name: 'Taxes' },
  { id: 'retirement', name: 'Retirement' },
  { id: 'credit', name: 'Credit' },
];

// Helper function to generate slugs for heading IDs
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -

const GuideDetailPage = () => {
  const { guideId } = useParams();
  const navigate = useNavigate();

  const guide = useMemo(
    () => guideArticles.find((g) => g.id === parseInt(guideId)),
    [guideId]
  );

  const [activeTocId, setActiveTocId] = useState('');
  const [copied, setCopied] = useState(false);
  const contentRef = useRef(null);

  // Generate Table of Contents from H2 headings
  const tableOfContents = useMemo(() => {
    if (!guide?.content) return [];
    return guide.content
      .filter((item) => item.type === 'heading' && item.level === 2)
      .map((item) => ({
        text: item.text,
        id: slugify(item.text),
      }));
  }, [guide]);

  // Intersection Observer for highlighting active ToC item
  useEffect(() => {
    if (!tableOfContents.length || !contentRef.current) return;

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Prioritize entries that are more visible
          if (entry.intersectionRatio > 0.5) {
             setActiveTocId(entry.target.id);
          }
        }
      });
        // Fallback if no item is highly visible but some are intersecting
        const intersectingEntry = entries.find(e => e.isIntersecting);
        if (intersectingEntry && !entries.some(e => e.isIntersecting && e.intersectionRatio > 0.5)) {
            setActiveTocId(intersectingEntry.target.id);
        }
    };
    
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-10% 0px -60% 0px', // Trigger when heading is in the top 40% of viewport
      threshold: [0, 0.5, 1],
    });

    const elements = tableOfContents.map(item => document.getElementById(item.id)).filter(Boolean);
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, [tableOfContents]);


  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  };

  if (!guide) {
    return (
      <>
        <SEOHead title="Guide Not Found | WageCalculator" />
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4">
          <div className="text-center max-w-md">
            <NotFoundIcon className="w-20 h-20 text-primary-300 mx-auto mb-6" />
            <h1 className="text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">Guide Not Found</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Oops! The financial guide you're looking for couldn't be found.
            </p>
            <Link
              to="/financial-guides"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to All Guides
            </Link>
          </div>
        </div>
      </>
    );
  }

  const renderContent = (contentItem, index) => {
    const itemKey = `content-${index}-${contentItem.type}`;
    const headingId = contentItem.type === 'heading' ? slugify(contentItem.text) : undefined;

    switch (contentItem.type) {
      case 'heading':
        const HeadingTag = `h${contentItem.level}`;
        const baseClasses = "font-bold text-gray-900 mb-4 leading-tight";
        const headingSpecificClasses = {
          // H1 is the page title, so content starts from H2
          2: `text-2xl md:text-3xl mt-8 scroll-mt-24 ${baseClasses}`, // scroll-mt for sticky header offset
          3: `text-xl md:text-2xl mt-6 ${baseClasses.replace('mb-4', 'mb-3')}`,
          4: `text-lg md:text-xl mt-6 font-semibold ${baseClasses.replace('mb-4', 'mb-3')}`
        };
        return (
          <HeadingTag key={itemKey} id={headingId} className={headingSpecificClasses[contentItem.level] || baseClasses}>
            {contentItem.text}
          </HeadingTag>
        );
      case 'paragraph':
        return (
          <p key={itemKey} className="text-gray-700 leading-relaxed mb-5 text-base md:text-lg">
            {contentItem.text}
          </p>
        );
      case 'list':
        return (
          <ul key={itemKey} className="list-disc pl-6 text-gray-700 mb-5 space-y-2 text-base md:text-lg">
            {contentItem.items.map((item, itemIndex) => (
              <li key={`${itemKey}-item-${itemIndex}`} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };
  
  const articleUrl = typeof window !== 'undefined' ? window.location.href : `https://yourwebsite.com/financial-guides/${guide.id}`;

  const handleShare = async (platform) => {
    let url = '';
    const encodedUrl = encodeURIComponent(articleUrl);
    const title = encodeURIComponent(guide.title);

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${title}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(articleUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy: ', err);
          alert('Failed to copy link.'); // Or use a more subtle notification
        }
        return;
      default:
        return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };


  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.description,
    "keywords": guide.keywords,
    "url": articleUrl,
    // "datePublished": guide.datePublished || new Date().toISOString().split('T')[0], // Add if available
    // "dateModified": guide.dateModified || guide.datePublished || new Date().toISOString().split('T')[0], // Add if available
    "author": { "@type": "Organization", "name": "WageCalculator" }, // Change to Person if you have author data
    "publisher": {
      "@type": "Organization",
      "name": "WageCalculator",
      // "logo": { "@type": "ImageObject", "url": "https://yourwebsite.com/logo.png" }
    },
    // "image": [ guide.imageUrl || "https://yourwebsite.com/default-article-image.jpg" ], // Add if available
    "mainEntityOfPage": { "@type": "WebPage", "@id": articleUrl }
  };

  const relatedGuides = guideArticles.filter(
    art => art.id !== guide.id && art.category === guide.category
  ).slice(0, 3); // Get up to 3 related guides from the same category

  return (
    <>
      <SEOHead
        title={`${guide.title} | WageCalculator Financial Guides`}
        description={guide.description}
        keywords={guide.keywords}
        structuredData={articleStructuredData}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Article Header Section */}
        <header className="bg-gradient-to-br from-primary-600 via-primary-700 to-blue-700 text-white pt-10 pb-12 md:pt-16 md:pb-20 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 md:mb-8">
              <Link
                to="/financial-guides"
                className="inline-flex items-center gap-2 text-blue-100 hover:text-white group transition-colors text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to All Guides
              </Link>
            </div>

            <div className="text-left">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-blue-200 mb-3 md:mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                  <Tag className="h-4 w-4" />
                  <Link to={`/financial-guides?category=${guide.category}`} className="hover:underline">
                    {getCategoryName(guide.category)}
                  </Link>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {guide.readTime}
                </span>
                {/* Add datePublished/dateModified here if available in your data */}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 md:mb-5 tracking-tight text-balance">
                {guide.title}
              </h1>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl">
                {guide.description}
              </p>
            </div>
          </div>
        </header>

        {/* Main Content Layout */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="lg:flex lg:gap-x-12">
            {/* Table of Contents Sidebar (Desktop) */}
            {tableOfContents.length > 0 && (
              <aside className="hidden lg:block lg:w-1/4 xl:w-1/5 flex-shrink-0">
                <div className="sticky top-24 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2 flex items-center">
                    <List className="w-5 h-5 mr-2 text-primary-600" />
                    On This Page
                  </h3>
                  <nav>
                    <ul className="space-y-1.5 max-h-[calc(100vh-10rem)] overflow-y-auto">
                      {tableOfContents.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                              navigate(`#${item.id}`, { replace: true }); // Update URL hash
                            }}
                            className={`block text-sm py-1 px-2 rounded-md transition-all duration-150
                              ${activeTocId === item.id
                                ? 'bg-primary-50 text-primary-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600'
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

            {/* Article Content */}
            <main ref={contentRef} className="flex-grow lg:w-3/4 xl:w-4/5 bg-white rounded-xl shadow-xl overflow-hidden p-0 md:p-px"> {/* md:p-px for slight border effect if desired */}
              {/* Optional: Article Hero Image (if guide.imageUrl exists) */}
              {/* {guide.imageUrl && <img src={guide.imageUrl} alt={guide.title} className="w-full h-64 md:h-80 object-cover mb-6 md:mb-8 rounded-t-xl" />} */}
              
              <article className="p-6 sm:p-8 lg:p-10 prose prose-lg max-w-none prose-indigo hover:prose-a:text-primary-600 prose-headings:tracking-tight prose-headings:font-semibold prose-h2:text-2xl prose-h3:text-xl prose-li:my-1">
                {guide.content.map((contentItem, index) => renderContent(contentItem, index))}
              </article>

              {/* Share buttons */}
              <div className="px-6 sm:px-8 lg:px-10 py-8 mt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Share this guide:</h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => handleShare('twitter')} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1DA1F2] rounded-lg hover:bg-[#1a91da] transition-colors">
                    <Twitter size={18} /> Share on Twitter
                  </button>
                  <button onClick={() => handleShare('linkedin')} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0077B5] rounded-lg hover:bg-[#00669c] transition-colors">
                    <Linkedin size={18} /> Share on LinkedIn
                  </button>
                  <button onClick={() => handleShare('facebook')} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1877F2] rounded-lg hover:bg-[#166de2] transition-colors">
                    <Facebook size={18} /> Share on Facebook
                  </button>
                  <button onClick={() => handleShare('copy')} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                    {copied ? <CheckCircle size={18} className="text-green-600" /> : <Copy size={18} />} {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedGuides.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-t border-gray-200 mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedGuides.map((relatedGuide) => (
                <Link key={relatedGuide.id} to={`/financial-guides/${relatedGuide.id}`} className="block group">
                  <div className="bg-white rounded-xl shadow-lg p-6 h-full hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1 border border-gray-200 hover:border-primary-300">
                    {/* You'd need to get icon & color for related guides, or have a default */}
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 transition-colors mb-2">
                      {relatedGuide.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-grow mb-3">
                      {relatedGuide.description.substring(0, 100)}...
                    </p>
                    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                      <span>{getCategoryName(relatedGuide.category)}</span>
                      <span>{relatedGuide.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA to All Guides */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Link
            to="/financial-guides"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Explore All Financial Guides
          </Link>
        </div>
      </div>
    </>
  );
};

export default GuideDetailPage;