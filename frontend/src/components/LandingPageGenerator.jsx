import { useState } from 'react';

/**
 * Landing page generator component that creates testable landing pages 
 * from trend opportunities.
 */
const LandingPageGenerator = ({ trendConcept, onGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [landingPageData, setLandingPageData] = useState(null);
  const [pageStyle, setPageStyle] = useState('modern');
  const [valueProposition, setValueProposition] = useState('');
  
  // Initialize value proposition based on trend concept
  useState(() => {
    if (trendConcept) {
      const defaultValueProp = `Experience the future of oral care with ${trendConcept.concept.toLowerCase()}.`;
      setValueProposition(defaultValueProp);
    }
  }, [trendConcept]);
  
  // Generate landing page
  const handleGenerate = async () => {
    if (!trendConcept) return;
    
    setIsGenerating(true);
    
    try {
      // In a full implementation, this would call the backend
      // For the MVP, we'll generate the landing page data client-side
      
      // Create a page ID using concept and timestamp
      const pageId = `${trendConcept.concept.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${Date.now()}`;
      
      // Generate landing page data
      const newPage = {
        id: pageId,
        title: trendConcept.concept,
        style: pageStyle,
        valueProposition: valueProposition,
        description: trendConcept.description,
        createdAt: new Date().toISOString(),
        url: `/landing-pages/${pageId}`,
        concept: trendConcept,
        metrics: {
          views: 0,
          clicks: 0,
          conversionRate: 0,
        }
      };
      
      setLandingPageData(newPage);
      
      // Call the callback with the generated page
      if (onGenerated) {
        onGenerated(newPage);
      }
    } catch (error) {
      console.error('Error generating landing page:', error);
      alert('Failed to generate landing page. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="landing-page-generator" style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '20px'
    }}>
      <h3>Generate Landing Page Test</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Value Proposition:
        </label>
        <textarea
          value={valueProposition}
          onChange={(e) => setValueProposition(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            minHeight: '60px'
          }}
          placeholder="Enter your value proposition..."
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Page Style:
        </label>
        <select
          value={pageStyle}
          onChange={(e) => setPageStyle(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          <option value="modern">Modern</option>
          <option value="minimal">Minimal</option>
          <option value="bold">Bold</option>
        </select>
      </div>
      
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !valueProposition.trim()}
        style={{
          padding: '10px 16px',
          backgroundColor: isGenerating ? '#ccc' : '#4a90e2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          fontWeight: '500'
        }}
      >
        {isGenerating ? 'Generating...' : 'Generate Landing Page'}
      </button>
      
      {landingPageData && (
        <div style={{ marginTop: '15px', padding: '15px', background: '#f5f5f5', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Landing Page Created!</h4>
          <p><strong>URL:</strong> {landingPageData.url}</p>
          <p><strong>Title:</strong> {landingPageData.title}</p>
          <p><strong>Style:</strong> {landingPageData.style}</p>
          <button
            onClick={() => window.open(`#/preview/${landingPageData.id}`, '_blank')}
            style={{
              padding: '8px 12px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            View Landing Page
          </button>
        </div>
      )}
    </div>
  );
};

export default LandingPageGenerator;
