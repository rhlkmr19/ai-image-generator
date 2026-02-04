import React, { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setLoading(true);
    setImageUrl('');

    try {
      const response = await fetch('https://agentrouter.org/api/v1/text-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_AGENTROUTER_API_KEY}`
        },
        body: JSON.stringify({
          prompt: prompt,
          model: 'flux-schnell'
        })
      });

      const data = await response.json();
      
      if (data.image_url) {
        setImageUrl(data.image_url);
      } else if (data.images && data.images[0]) {
        setImageUrl(data.images[0].url);
      } else {
        alert('Failed to generate image');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>AI Image Generator</h1>
        <p className="subtitle">Powered by AgentRouter API</p>
        
        <div className="input-section">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your image description..."
            rows="4"
          />
          <button 
            onClick={generateImage} 
            disabled={loading}
            className="generate-btn"
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Creating your image...</p>
          </div>
        )}

        {imageUrl && (
          <div className="image-section">
            <h3>Generated Image:</h3>
            <img src={imageUrl} alt="Generated" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
