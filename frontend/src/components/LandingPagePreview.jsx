import React from 'react';

/**
 * Displays a preview of the generated landing page for trend validation.
 */
const LandingPagePreview = ({ pageData }) => {
  if (!pageData) {
    return (
      <div className="landing-page-empty" style={{ 
        textAlign: 'center', 
        padding: '40px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px' 
      }}>
        <h3>No landing page selected</h3>
        <p>Generate a landing page from a trend concept to preview it here.</p>
      </div>
    );
  }

  // Different style templates
  const styles = {
    modern: {
      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
      backgroundColor: "#ffffff",
      color: "#333333",
      primaryColor: "#4a90e2",
      secondaryColor: "#f8f8f8",
      buttonColor: "#4a90e2"
    },
    minimal: {
      fontFamily: "'Helvetica', Arial, sans-serif",
      backgroundColor: "#ffffff",
      color: "#212121",
      primaryColor: "#212121",
      secondaryColor: "#fafafa",
      buttonColor: "#000000"
    },
    bold: {
      fontFamily: "'Montserrat', 'Segoe UI', sans-serif",
      backgroundColor: "#ffffff",
      color: "#333333",
      primaryColor: "#ff5722",
      secondaryColor: "#f5f5f5",
      buttonColor: "#ff5722"
    }
  };

  // Select the style based on pageData
  const styleTemplate = styles[pageData.style] || styles.modern;

  return (
    <div className="landing-page-preview" style={{ 
      border: '1px solid #e0e0e0', 
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div className="preview-header" style={{
        backgroundColor: '#f5f5f5',
        padding: '10px 15px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h4 style={{ margin: 0 }}>Landing Page Preview</h4>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {pageData.url}
          </div>
        </div>
        <div>
          <button 
            style={{
              padding: '5px 10px',
              backgroundColor: '#4caf50', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            Publish Test
          </button>
        </div>
      </div>

      {/* Landing page content */}
      <div className="page-content" style={{
        fontFamily: styleTemplate.fontFamily,
        backgroundColor: styleTemplate.backgroundColor,
        color: styleTemplate.color,
      }}>
        {/* Hero section */}
        <div className="hero-section" style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: styleTemplate.secondaryColor,
          borderBottom: '1px solid #eee'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '20px', 
            color: styleTemplate.primaryColor 
          }}>
            {pageData.title}
          </h1>
          
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '400', 
            maxWidth: '600px', 
            margin: '0 auto 30px auto',
            lineHeight: '1.5'
          }}>
            {pageData.valueProposition}
          </h2>
          
          <button style={{
            backgroundColor: styleTemplate.buttonColor,
            color: 'white',
            padding: '12px 30px',
            fontSize: '1.1rem',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            Learn More
          </button>
        </div>
        
        {/* Features section */}
        <div className="features-section" style={{
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '40px' }}>Key Benefits</h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '30px'
          }}>
            {/* Feature 1 */}
            <div style={{ 
              flex: '1 1 250px', 
              padding: '20px', 
              backgroundColor: styleTemplate.secondaryColor,
              borderRadius: '8px'
            }}>
              <h3>Innovative</h3>
              <p>Leading the way with the latest advancements in oral care technology.</p>
            </div>
            
            {/* Feature 2 */}
            <div style={{ 
              flex: '1 1 250px', 
              padding: '20px', 
              backgroundColor: styleTemplate.secondaryColor,
              borderRadius: '8px'
            }}>
              <h3>Effective</h3>
              <p>Clinically proven to deliver exceptional results from day one.</p>
            </div>
            
            {/* Feature 3 */}
            <div style={{ 
              flex: '1 1 250px', 
              padding: '20px', 
              backgroundColor: styleTemplate.secondaryColor,
              borderRadius: '8px'
            }}>
              <h3>Convenient</h3>
              <p>Seamlessly integrates into your daily oral care routine.</p>
            </div>
          </div>
        </div>
        
        {/* Description section */}
        <div className="description-section" style={{
          padding: '60px 20px',
          backgroundColor: styleTemplate.secondaryColor,
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Why Choose Us?</h2>
          <p style={{ 
            maxWidth: '700px', 
            margin: '0 auto', 
            lineHeight: '1.7',
            fontSize: '1.1rem'
          }}>
            {pageData.description}
          </p>
          
          <div style={{ marginTop: '40px' }}>
            <button style={{
              backgroundColor: styleTemplate.buttonColor,
              color: 'white',
              padding: '12px 30px',
              fontSize: '1.1rem',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: '600',
              marginRight: '15px'
            }}>
              Get Started
            </button>
            
            <button style={{
              backgroundColor: 'transparent',
              color: styleTemplate.buttonColor,
              padding: '12px 30px',
              fontSize: '1.1rem',
              border: `2px solid ${styleTemplate.buttonColor}`,
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              Learn More
            </button>
          </div>
        </div>
        
        {/* CTA Footer */}
        <div className="cta-footer" style={{
          padding: '40px 20px',
          textAlign: 'center',
          borderTop: '1px solid #eee'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Ready to transform your oral care experience?</h3>
          <button style={{
            backgroundColor: styleTemplate.buttonColor,
            color: 'white',
            padding: '12px 30px',
            fontSize: '1.1rem',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            fontWeight: '600'
          }}>
            Register for Early Access
          </button>
          
          <p style={{ 
            fontSize: '14px', 
            color: '#777', 
            marginTop: '20px' 
          }}>
            Limited spots available. Sign up now to secure your place.
          </p>
        </div>
      </div>
      
      {/* Metrics dashboard */}
      <div className="metrics-dashboard" style={{
        padding: '15px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f9f9f9'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Live Metrics</h4>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{pageData.metrics.views}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Views</div>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{pageData.metrics.clicks}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Clicks</div>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{pageData.metrics.conversionRate}%</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Conversion</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPagePreview;
