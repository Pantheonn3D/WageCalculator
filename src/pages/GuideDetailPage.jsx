import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, BookOpen as NotFoundIcon } from 'lucide-react'; // Added NotFoundIcon
import SEOHead from '../components/seo/SEOHead';
import { guideArticles } from '../data/guideArticles'; // Assuming this is your data source
// import { categories } from './FinancialGuides'; // If you want to display full category name

const GuideDetailPage = () => {
  const { guideId } = useParams(); // Using guideId as per your current setup
  const guide = guideArticles.find(g => g.id === parseInt(guideId));

  // Find full category name (optional, if you have categories array available)
  // const categoryName = categories.find(cat => cat.id === guide?.category)?.name || guide?.category;

  if (!guide) {
    return (
      <>
        <SEOHead title="Guide Not Found | WageCalculator" />
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4">
          <div className="text-center max-w-md">
            <NotFoundIcon className="w-20 h-20 text-primary-300 mx-auto mb-6" />
            <h1 className="text-4xl font-extrabold text-gray-800 mb-3 tracking-tight">Guide Not Found</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Oops! The financial guide you're looking for couldn't be found. It might have been moved or no longer exists.
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
    switch (contentItem.type) {
      case 'heading':
        const HeadingTag = `h${contentItem.level}`;
        // prose handles heading styles, but you can add more if needed
        // For example, ensuring slightly more top margin for h2 than prose default
        const headingBaseClasses = "font-bold text-gray-900 mb-4 leading-tight";
        const headingSpecificClasses = {
          1: `text-3xl md:text-4xl mt-10 ${headingBaseClasses}`, // Should only be one H1 (page title)
          2: `text-2xl md:text-3xl mt-8 ${headingBaseClasses}`,
          3: `text-xl md:text-2xl mt-6 ${headingBaseClasses.replace('mb-4', 'mb-3')}`, // Slightly less bottom margin for h3
          4: `text-lg md:text-xl mt-6 font-semibold ${headingBaseClasses.replace('mb-4', 'mb-3')}`
        };
        return (
          <HeadingTag key={index} className={headingSpecificClasses[contentItem.level] || headingBaseClasses}>
            {contentItem.text}
          </HeadingTag>
        );
      
      case 'paragraph':
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-5 text-base md:text-lg">
            {contentItem.text}
          </p>
        );
      
      case 'list':
        return (
          <ul key={index} className="list-disc pl-6 text-gray-700 mb-5 space-y-2 text-base md:text-lg">
            {contentItem.items.map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        );
      
      // You can add more cases here for images, blockquotes, code blocks etc.
      // case 'image':
      //   return <img key={index} src={contentItem.src} alt={contentItem.alt} className="my-6 rounded-lg shadow-md" />;
      // case 'blockquote':
      //   return <blockquote key={index} className="border-l-4 border-primary-500 pl-4 italic text-gray-600 my-6">{contentItem.text}</blockquote>

      default:
        return null;
    }
  };
  
  // More detailed structured data for the article
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.description,
    "keywords": guide.keywords, // Assuming guide.keywords is a comma-separated string
    "url": `https://yourwebsite.com/financial-guides/${guide.id}`, // Replace with your actual URL structure
    // "datePublished": guide.datePublished || new Date().toISOString().split('T')[0], // Add if you have publish dates
    // "dateModified": guide.dateModified || new Date().toISOString().split('T')[0],  // Add if you have modification dates
    "author": { "@type": "Organization", "name": "WageCalculator" }, // Or Person
    "publisher": {
      "@type": "Organization",
      "name": "WageCalculator",
      // "logo": { "@type": "ImageObject", "url": "https://yourwebsite.com/logo.png" } // URL to your logo
    },
    // "image": [ guide.imageUrl || "https://yourwebsite.com/default-article-image.jpg" ], // Add if you have images
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://yourwebsite.com/financial-guides/${guide.id}`
    }
  };


  return (
    <>
      <SEOHead 
        title={`${guide.title} | WageCalculator Financial Guides`}
        description={guide.description}
        keywords={guide.keywords} // Ensure this is a string like "keyword1, keyword2"
        structuredData={articleStructuredData}
      />
      
      <div className="min-h-screen bg-gray-100">
        {/* Article Header Section */}
        <header className="bg-gradient-to-br from-primary-600 via-primary-700 to-blue-700 text-white pt-10 pb-16 md:pt-16 md:pb-20 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link 
                to="/financial-guides" 
                className="inline-flex items-center gap-2 text-blue-100 hover:text-white group transition-colors text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to All Guides
              </Link>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 text-sm text-blue-200 mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm`}>
                  <Tag className="h-4 w-4" />
                  {guide.category.charAt(0).toUpperCase() + guide.category.slice(1)}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                  <Clock className="h-4 w-4" />
                  {guide.readTime}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight text-balance">
                {guide.title}
              </h1>
              
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                {guide.description}
              </p>
            </div>
          </div>
        </header>
        
        {/* Main Article Content */}
        <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-0 -mt-10 md:-mt-12 relative z-10">
          <article className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Optional: Article Hero Image */}
            {/* {guide.imageUrl && <img src={guide.imageUrl} alt={guide.title} className="w-full h-64 md:h-80 object-cover" />} */}
            
            <div className="p-6 sm:p-8 lg:p-10 prose prose-lg max-w-none prose-indigo hover:prose-a:text-primary-600 prose-headings:tracking-tight">
              {/* prose-indigo provides nice default styles, adjust as needed */}
              {/* prose-headings:font-bold prose-headings:text-gray-900 etc. can be added */}
              {guide.content.map((contentItem, index) => renderContent(contentItem, index))}
            </div>
          </article>
          
          {/* Optional: Related Articles or CTA */}
          <div className="mt-12 py-8 text-center border-t border-gray-200">
            <p className="text-gray-600 mb-4">Found this guide helpful?</p>
            <Link 
              to="/financial-guides" 
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Explore More Guides
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuideDetailPage;