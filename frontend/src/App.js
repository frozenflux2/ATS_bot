import React, { useState } from 'react';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [levels, setLevels] = useState('');
  const [specialities, setSpecialities] = useState('');
  const [languages, setLanguages] = useState('');
  const [benefits, setBenefits] = useState('');
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
        setJobTitle(data.job_titles.join(', '));
        // setSkills(data.skillsets.join(', '));
        setLevels(data.levels.join(', '));
        setSpecialities(data.specialties.join(', '));
        setLanguages(data.languages.join(', '));
        setBenefits(data.benefits.join(', '));
      } else {
        console.error('Failed to fetch job title');
        setJobTitle('Error fetching job title');
        setSkills('');
        setLevels('');
        setSpecialities('');
        setLanguages('');
        setBenefits('');
      }
    } catch (error) {
      console.error('Error:', error);
      setJobTitle('Error fetching job title');
      setSkills('');
      setLevels('');
      setSpecialities('');
      setLanguages('');
      setBenefits('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Job Posting Helper</h1>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Enter job description here"
        rows={10}
        style={{ width: '100%' }}
      />
      <button onClick={handleSubmit} style={{ marginTop: '10px' }} disabled={isLoading || !jobDescription}>
        {isLoading ? 'Extracting...' : 'Extract'}
      </button>
      <div style={{ marginTop: '20px' }}>
        <h3>Job Title:</h3>
        <textarea
          value={jobTitle}
          readOnly
          rows={1}
          style={{ width: '100%' }}
        />
      </div>
      {/* <div style={{ marginTop: '20px' }}>
        <h3>Required Skills:</h3>
        <textarea
          value={skills}
          readOnly
          rows={1}
          style={{ width: '100%' }}
        />
      </div> */}
      <div style={{ marginTop: '20px' }}>
        <h3>Required Levels:</h3>
        <textarea
          value={levels}
          readOnly
          rows={1}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Required Specialities:</h3>
        <textarea
          value={specialities}
          readOnly
          rows={1}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Required Languages:</h3>
        <textarea
          value={languages}
          readOnly
          rows={1}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Required Benefits:</h3>
        <textarea
          value={benefits}
          readOnly
          rows={1}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

export default App;