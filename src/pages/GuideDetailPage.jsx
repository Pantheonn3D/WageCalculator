import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { guideArticles } from '../data/guideArticles';

const GuideDetailPage = () => {
  const { guideId } = useParams();
  const guide = guideArticles.find(g => g.id === parseInt(guideId));

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Guide Not Found</h1>
            <p className="text-gray-600 mb-8">The guide you're looking for doesn't exist.</p>
            <Link 
              to="/financial-guides" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Financial Guides
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = (contentItem, index) => {
    switch (contentItem.type) {
      case 'heading':
        const HeadingTag = `h${contentItem.level}`;
        const headingClasses = {
          2: 'text-2xl font-bold text-gray-900 mt-8 mb-4',
          3: 'text-xl font-semibold text-gray-900 mt-6 mb-3'
        };
        return (
          <HeadingTag key={index} className={headingClasses[contentItem.level]}>
            {contentItem.text}
          </HeadingTag>
        );
      
      case 'paragraph':
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-4">
            {contentItem.text}
          </p>
        );
      
      case 'list':
        return (
          <ul key={index} className="list-disc list-inside text-gray-700 mb-4 space-y-2">
            {contentItem.items.map((item, itemIndex) => (
              <li key={itemIndex} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <SEOHead 
        title={`${guide.title} | WageCalculator`}
        description={guide.description}
        keywords={guide.keywords}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Link 
              to="/financial-guides" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Financial Guides
            </Link>
            
            <div className="mb-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {guide.readTime}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {guide.category}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {guide.title}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {guide.description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          <article className="prose prose-lg max-w-none">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {guide.content.map((contentItem, index) => renderContent(contentItem, index))}
            </div>
          </article>
          
          <div className="mt-8 text-center">
            <Link 
              to="/financial-guides" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Guides
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuideDetailPage;