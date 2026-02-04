import React, { useState } from 'react';
import './App.css';

function App() {
  const [topic, setTopic] = useState('');
  const [seoContent, setSeoContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateSEO = async () => {
    if (!topic.trim()) {
      alert('Please enter a video topic');
      return;
    }

    setLoading(true);
        console.log('API Key:', process.env.REACT_APP_AGENTROUTER_API_KEY ? 'Found' : 'Missing');
    setSeoContent(null);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_AGENTROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'user',
              content: `Generate complete YouTube SEO for a video about: "${topic}"

Provide:
1. Catchy Title (max 60 characters)
2. Full Description (300-500 words with timestamps)
3. 20-30 Relevant Tags
4. Thumbnail Text Suggestion
5. 5 Engaging Hooks for the first 10 seconds

Format it clearly with headings.`
            }
          ]
        })
      });

      const data = await response.json();

      if (data.choices && data.choices[0]?.message?.content) {
        setSeoContent(data.choices[0].message.content);
      } else if (data.error) {
        alert('Error: ' + data.error.message);
      } else {
        alert('Failed to generate SEO content');
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
        <h1>YouTube SEO Generator</h1>
        <p className="subtitle">Powered by AgentRouter API</p>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter your video topic (e.g., 'Best AI tools for beginners')"
          onKeyPress={(e) => e.key === 'Enter' && generateSEO()}
        />
        <button onClick={generateSEO} disabled={loading}>
          {loading ? 'Generating...' : 'Generate SEO'}
        </button>
        {seoContent && (
          <div className="seo-result">
            <pre>{seoContent}</pre>
            <button onClick={() => navigator.clipboard.writeText(seoContent)}>
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
