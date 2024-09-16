import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from '@mui/material/Slider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';

const ReportIssueForm = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(5); // Default severity value set to 5
  const [contact, setContact] = useState('');
  const [image, setImage] = useState(null); // This should be defined to handle file selection
  const [date, setDate] = useState(dayjs('2022-07-14'));
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // useNavigate for redirection

  const valuetext = (value) => {
    return `${value}`; // This function returns the severity value as a string
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Store the selected file in state
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError('');
    setSuccess('');

    // Prepare the form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('subject', subject);
    formData.append('description', description);
    formData.append('severity', severity);
    formData.append('contact', contact);
    formData.append('date', date.format('YYYY-MM-DD'));
    formData.append('image', image); // Append the selected image

    try {
      // Send POST request to the server with form data
      const response = await fetch('http://localhost:5000/user/report', {
        method: 'POST',
        body: formData, // Use formData to send multipart/form-data
      });

      if (response.ok) {
        // If the response is successful, navigate to user home
        console.log('Issue reported successfully');
        setSuccess('Issue reported successfully');
        navigate('/user/home');
      } else {
        // If the response is not ok, log the error
        const errorData = await response.json();
        console.error('Failed to report the issue:', errorData.message);
        setError(errorData.message);
      }
    } catch (error) {
      console.log('Error during reporting the issue:', error);
      setError('An error occurred while reporting the issue. Please try again later.');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='reportwrap'>
        <h2>Report an Issue</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            className='input-box'
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className='input-box'
            type="text"
            placeholder="Subject (should not be more than 20 characters)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <input
            className='input-box'
            type="text"
            placeholder="Describe your issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            className='input-box'
            type="text"
            placeholder="Contact Information"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          <div className='slider-container'>
            <label htmlFor="severity">Severity: {severity}</label>
            <Slider
              aria-label="Severity"
              defaultValue={5}
              getAriaValueText={valuetext}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
              value={severity}
              onChange={(e, value) => setSeverity(value)}
            />
          </div>
          <div className='date-picker-container'>
            <DatePicker
              label="Select Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              format="YYYY-MM-DD"
            />
          </div>
          <div>
            <label htmlFor="image">Upload Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>
          <button
            type="submit"
            className='mx-4 w-[90%] h-[45px] bg-[#100b03] border-none outline-none rounded-lg cursor-pointer text-base text-white font-medium'>
            Submit
          </button>
          {success && <div style={{ color: 'green', textAlign: 'center' }}>{success}</div>}
          {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        </form>
      </div>
    </LocalizationProvider>
  );
}

export default ReportIssueForm;
