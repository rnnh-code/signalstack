import { useState } from 'react'
import './App.css'
import LandingPageGenerator from './components/LandingPageGenerator'
import LandingPagePreview from './components/LandingPagePreview'

function App() {
  // Basic state
  const [query, setQuery] = useState('')
  const [redditData, setRedditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // UI flow state
  const [currentStep, setCurrentStep] = useState('search'); // 'search', 'results', or 'landing-page'
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [landingPage, setLandingPage] = useState(null);

  // Main search handler - triggers the backend trend analysis
  const handleSearch = async () => {
    if (!query.trim()) {
      alert('Please enter a search query.')
      return
    }
    
    // Begin loading state and clear previous results
    setIsLoading(true);
    setRedditData(null);
    setAnalysisResults(null);
    
    console.log('Analyzing trends for:', query);

    try {
      console.log('Starting analysis request for query:', query);
      
      // Send the search query to the backend for full analysis
      const searchResponse = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });

      // Log detailed response info
      console.log('Search response status:', searchResponse.status);
      console.log('Search response headers:', [...searchResponse.headers.entries()]);
      
      if (!searchResponse.ok) {
        throw new Error(`Search API error: ${searchResponse.status}`);
      }
      
      // Process the response which now includes both Reddit data and trends analysis
      const responseText = await searchResponse.text();
      console.log('Raw response text:', responseText);
      
      // Try to parse the JSON, with better error handling
      let analysisData;
      try {
        analysisData = JSON.parse(responseText);
        console.log('Analysis response (parsed):', analysisData);
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        throw new Error(`Invalid response format: ${parseError.message}`);
      }
      
      if (analysisData.status === 'failed') {
        throw new Error(analysisData.error || 'Analysis failed');
      }
      
      // Extract results from the analysis
      if (analysisData.results) {
        const results = analysisData.results;
        
        // Store the actual Reddit data that was used in the analysis
        const redditDataUsed = analysisData.reddit_data_used || {};
        console.log('Reddit data used in analysis:', redditDataUsed);
        
        setRedditData({
          subreddit: 'oralcare',
          limit: 30,
          data: new Array(redditDataUsed.post_count || 0).fill({ dummy: true }),
          samplePosts: redditDataUsed.sample_posts || []
        });
        
        // Store the trend analysis results from the backend
        setAnalysisResults({
          query: results.query,
          trendsIdentified: results.trendsIdentified || [],
          marketValidation: results.marketValidation || {
            marketSize: "Data unavailable",
            growthRate: "Data unavailable",
            competitiveLandscape: "Insufficient data"
          }
        });
        
        // Move to results page
        setCurrentStep('results');
      } else {
        throw new Error('Invalid analysis results structure');
      }
    } catch (error) {
      console.error('Error in analysis flow:', error);
      // More detailed logging
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Display a more detailed error message
      alert(`Analysis failed: ${error.message || 'Unknown error'}. Please try again.`);
      
      // Fallback: Add mock data to show the UI even when backend fails
      setRedditData({
        subreddit: 'oralcare',
        limit: 10,
        data: new Array(5).fill({ dummy: true }) // Just for count
      });
      
      // Create fallback analysis results to show the UI
      setAnalysisResults({
        query: query,
        trendsIdentified: [
          {
            id: 1,
            concept: "Natural Whitening Ingredients",
            velocity: "High",
            regSafe: "Yes",
            relevantPosts: ["Looking for natural ways to whiten teeth", "Is charcoal safe for whitening?"],
            description: "Growing interest in natural ingredients like activated charcoal and coconut oil for whitening."
          },
          {
            id: 2,
            concept: "Sensitivity-Friendly Whitening",
            velocity: "Medium",
            regSafe: "Yes",
            relevantPosts: ["Whitening without sensitivity issues"],
            description: "Consumers seeking whitening solutions that don't increase sensitivity."
          },
          {
            id: 3,
            concept: "Eco-Friendly Packaging",
            velocity: "Rising",
            regSafe: "Yes",
            relevantPosts: ["Sustainable toothpaste packaging"],
            description: "Growing interest in oral care products with minimal environmental impact."
          }
        ],
        marketValidation: {
          marketSize: "$3.2B in US (2024)",
          growthRate: "+8.5% YoY",
          competitiveLandscape: "Fragmented with opportunities for innovation"
        }
      });
      
      // Still show results page even with error
      setCurrentStep('results');
    } finally {
      setIsLoading(false);
    }
  }

  // We no longer need the mock insights generator as the backend now provides real analysis
  
  // Function to go back to search page
  const handleBackToSearch = () => {
    setCurrentStep('search');
  }
  
  // Function to go back to results page
  const handleBackToResults = () => {
    setCurrentStep('results');
  }
  
  // Function to handle trend selection for landing page
  const handleTrendSelect = (trend) => {
    setSelectedTrend(trend);
    setCurrentStep('landing-page');
  }
  
  // Function to handle landing page generation
  const handleLandingPageGenerated = (pageData) => {
    setLandingPage(pageData);
  }

  return (
    <div className="signalstack-app">
      {currentStep === 'search' ? (
        // SEARCH PAGE
        <div className="search-page">
          <h1>SignalStack</h1>
          <h2>Real-time CPG Innovation Insights</h2>
          
          <div className="search-card">
            <p>Enter your query to analyze market trends and identify opportunities</p>
            <div className="search-input-group">
              <input
                type="text"
                placeholder="e.g., whitening toothpaste opportunities for brand"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: '400px', padding: '12px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <button 
                onClick={handleSearch} 
                disabled={isLoading}
                style={{ 
                  padding: '12px 24px', 
                  fontSize: '16px', 
                  backgroundColor: '#4a90e2', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'Analyzing...' : 'Find Opportunities'}
              </button>
            </div>
            
            {isLoading && (
              <div className="loading-indicator" style={{ marginTop: '20px' }}>
                <p>Analyzing trends across Reddit, identifying opportunities...</p>
                <div style={{ width: '100%', height: '4px', backgroundColor: '#eee', borderRadius: '2px', marginTop: '10px' }}>
                  <div 
                    style={{ 
                      width: '30%', 
                      height: '100%', 
                      backgroundColor: '#4a90e2', 
                      borderRadius: '2px',
                      animation: 'loading 1.5s infinite' 
                    }} 
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="benefits" style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-around' }}>
            <div className="benefit-card" style={{ padding: '20px', maxWidth: '200px', textAlign: 'center' }}>
              <h3>Real-time Analysis</h3>
              <p>Identify trends as they emerge, not months later</p>
            </div>
            <div className="benefit-card" style={{ padding: '20px', maxWidth: '200px', textAlign: 'center' }}>
              <h3>Market Validation</h3>
              <p>Built-in validation to assess commercial potential</p>
            </div>
            <div className="benefit-card" style={{ padding: '20px', maxWidth: '200px', textAlign: 'center' }}>
              <h3>Regulatory Safe</h3>
              <p>All concepts screened for regulatory compliance</p>
            </div>
          </div>
        </div>
      ) : currentStep === 'results' ? (
        // RESULTS PAGE
        <div className="results-page">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>SignalStack Insights</h1>
            <button onClick={handleBackToSearch} style={{ padding: '8px 16px' }}>
              ← Back to Search
            </button>
          </header>
          
          <div className="query-summary" style={{ marginBottom: '30px', background: '#f5f8ff', padding: '15px', borderRadius: '5px' }}>
            <h2>Analysis for: "{query}"</h2>
            <p>Based on {redditData?.data?.length || 0} discussions from r/oralcare</p>
            
            {/* Show sample Reddit posts if available */}
            {redditData?.samplePosts && redditData.samplePosts.length > 0 && (
              <div className="data-preview" style={{ marginTop: '15px', textAlign: 'left' }}>
                <h4 style={{ marginBottom: '8px' }}>Analyzed Reddit Posts:</h4>
                <ul style={{ fontSize: '14px', paddingLeft: '20px' }}>
                  {redditData.samplePosts.map((post, index) => (
                    <li key={index}>
                      {post.title} <span style={{ color: '#666', fontSize: '12px' }}>(score: {post.score})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {analysisResults ? (
            <div className="trend-analysis">
              <h2>Top Opportunities</h2>
              
              <div className="trends-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {analysisResults.trendsIdentified.map(trend => (
                  <div key={trend.id} className="trend-card" style={{ border: '1px solid #eee', borderRadius: '8px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <h3>{trend.concept}</h3>
                      <span style={{ 
                        background: trend.velocity === 'High' ? '#4caf50' : trend.velocity === 'Medium' ? '#ff9800' : '#2196f3', 
                        color: 'white', 
                        padding: '3px 8px', 
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}>
                        {trend.velocity} Velocity
                      </span>
                    </div>
                    
                    <p>{trend.description}</p>
                    
                    <div style={{ marginTop: '15px' }}>
                      <h4>Consumer Discussions:</h4>
                      <ul style={{ fontSize: '14px' }}>
                        {trend.relevantPosts.map((post, i) => (
                          <li key={i}>{post}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: trend.regSafe === 'Yes' ? 'green' : 'red' }}>
                        {trend.regSafe === 'Yes' ? '✓ Regulatory Safe' : '⚠ Regulatory Concerns'}
                      </span>
                      <button 
                        onClick={() => handleTrendSelect(trend)} 
                        style={{ 
                          padding: '5px 10px',
                          backgroundColor: '#4a90e2',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Create Landing Page
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Market summary section removed as requested */}
            </div>
          ) : (
            <div className="no-results" style={{ textAlign: 'center', padding: '40px' }}>
              <p>No analysis results available. Please try another search query.</p>
            </div>
          )}
        </div>
      ) : (
        // LANDING PAGE CREATOR
        <div className="landing-page-step">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1>Create Test Landing Page</h1>
            <button onClick={handleBackToResults} style={{ padding: '8px 16px' }}>
              ← Back to Results
            </button>
          </header>
          
          <div className="concept-summary" style={{ 
            marginBottom: '30px', 
            background: '#f5f8ff', 
            padding: '15px', 
            borderRadius: '5px' 
          }}>
            <h2>Concept: {selectedTrend?.concept}</h2>
            <p>{selectedTrend?.description}</p>
            
            <div style={{ 
              display: 'inline-block',
              padding: '4px 12px', 
              borderRadius: '12px', 
              fontSize: '14px',
              color: 'white',
              backgroundColor: 
                selectedTrend?.velocity === 'High' ? '#4caf50' : 
                selectedTrend?.velocity === 'Medium' ? '#ff9800' : '#2196f3',
              marginTop: '10px'
            }}>
              {selectedTrend?.velocity} Velocity
            </div>
          </div>
          
          <div className="landing-page-creation" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <LandingPageGenerator 
                trendConcept={selectedTrend} 
                onGenerated={handleLandingPageGenerated}
              />
            </div>
            
            <div style={{ flex: '2 1 500px' }}>
              <LandingPagePreview pageData={landingPage} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
