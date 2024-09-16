import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminHome = () => {
  const [issues, setIssues] = useState([]); // State to store issues
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  // Fetch issues when the component mounts
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/issues'); // Fetch all issues from the backend
        setIssues(response.data); // Set the issues state with fetched data
        setLoading(false); // Stop loading
      } catch (err) {
        console.error('Error fetching issues:', err);
        setError('Failed to load issues. Please try again later.');
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchIssues();
  }, []);

  return (
    <div>
      <div>

      <h1 className='text-center text-3xl m-10 font-bold'>Welcome, Admin!</h1>
      <h2 className='text-center text-xl mt-12'>Reported Issues</h2>
      </div>



      {loading && <p>Loading issues...</p>} {/* Show loading state */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}

      <div className='flex justify-center'>
        {issues.length > 0 ? (

          <ul>
            {issues.map((issue) => (
              <div className='border-[2px] w-[80vw] items-center h-[40vh] flex m-6 rounded-lg'>

              <li className='flex justify-between p-5' key={issue._id}>
                <div>

                <h3 className='text-3xl py-1'>{issue.subject}</h3>
                <p><strong>Reported by:</strong> {issue.name}</p>
                <p><strong>Description:</strong> {issue.description}</p>
                <p><strong>Severity:</strong> {issue.severity}</p>
                <p><strong>Contact:</strong> {issue.contact}</p>
                <p><strong>Date:</strong> {issue.date}</p>
                </div>
                <div>

                {issue.cloudinary_id && (
                  <img className='ml-[40vw]' src={issue.cloudinary_id} alt="Issue Image" style={{ width: '200px', height: '200px' }} />
                )}
                </div>
              </li>
                </div>
            ))}
          </ul>
        ) : (
          <p>No issues reported yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminHome;