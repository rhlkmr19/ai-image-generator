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
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_AGENTROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: 'black-forest-labs/flux-schnell',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          modalities: ['image', 'text']
        })
      });

      const data = await response.json();

      if (data.choices && data.choices[0]?.message?.content) {
        const content = data.choices[0].message.content;
        // Extract image URL from content (it may be in different formats)
        const imageUrlMatch = content.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|webp|gif)/i);
        if (imageUrlMatch) {
          setImageUrl(imageUrlMatch[0]);
        } else if (content.includes('http')) {
          // Try to find any URL in the content
          const urlMatch = content.match(/https?:\/\/[^\s<>"]+/i);
          if (urlMatch) {
            setImageUrl(urlMatch[0]);
          } else {
            alert('Image URL not found in response');
          }
        } else {
          alert('Failed to generate image. Response: ' + JSON.stringify(data));
        }
      } else {
        alert('Failed to generate image: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>AI Image Generator</h1>
        <p className="subtitle">Powered by AgentRouter API</p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your image description here..."
          rows="4"
        />
        <button onClick={generateImage} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
        {imageUrl && (
          <div className="image-container">
            <img src={imageUrl} alt="Generated" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
