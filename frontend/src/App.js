import React, { useState } from 'react';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const apiEndpoint = process.env.REACT_APP_API_URL;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiEndpoint}/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: jobDescription }),
      });

      if (response.ok) {
        const data = await response.json();
        setJobTitle(data.titles.map(title => `${title.title}(${title.score})`).join(', '));
      } else {
        console.error('Failed to fetch job title');
        setJobTitle('Error fetching job title');
      }
    } catch (error) {
      console.error('Error:', error);
      setJobTitle('Error fetching job title');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Job Title Extractor</h1>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Enter job description here"
        rows={10}
        style={{ width: '100%' }}
      />
      <button onClick={handleSubmit} style={{ marginTop: '10px' }} disabled={isLoading || !jobDescription}>
        {isLoading ? 'Extracting...' : 'Extract Job Title'}
      </button>
      <div style={{ marginTop: '20px' }}>
        <h3>Extracted Job Title:</h3>
        <textarea
          value={jobTitle}
          readOnly
          rows={1}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

export default App;