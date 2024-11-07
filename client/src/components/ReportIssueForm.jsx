import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import dayjs from 'dayjs';
import {
  TextField,
  Slider,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Subject,
  Description,
  Phone,
  LocationOn,
  Image as ImageIcon,
} from '@mui/icons-material';
import UserNavbar from './UserNavbar';

const libraries = ['places'];

export default function ReportIssueForm() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    severity: 5,
    contact: '',
    date: dayjs(),
    location: '',
    image: null,
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const autocompleteRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      autocompleteRef.current = null; // Cleanup Autocomplete instance
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (_, newValue) => {
    setFormData((prev) => ({ ...prev, severity: newValue }));
  };

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({ ...prev, date: newValue }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      setFormData((prev) => ({ ...prev, location: place.formatted_address }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true); // Start loader

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'date') {
        formDataToSend.append(key, value.format('YYYY-MM-DD'));
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await fetch('http://localhost:5000/user/report', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSuccess('Issue reported successfully');
        setFormData({
          name: '',
          subject: '',
          description: '',
          severity: 5,
          contact: '',
          date: dayjs(),
          location: '',
          image: null,
        });
        setIsSubmitting(false); // Stop loader
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        setIsSubmitting(false); // Stop loader
      }
    } catch (error) {
      setError('An error occurred while reporting the issue. Please try again later.');
      setIsSubmitting(false); // Stop loader
    }
  };

  return (
    <LoadScript 
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} 
      libraries={libraries}
      onLoad={() => setIsLoaded(true)}
    >
      <UserNavbar/>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Report an Issue
            </Typography>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <TextField
                fullWidth
                margin="normal"
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                name="subject"
                label="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                inputProps={{ maxLength: 20 }}
                helperText="Max 20 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Subject />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                name="description"
                label="Describe your issue"
                value={formData.description}
                onChange={handleInputChange}
                required
                multiline
                rows={4}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Description />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                name="contact"
                label="Contact Information"
                value={formData.contact}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
              {isLoaded && (
                <Autocomplete
                  onLoad={(autocomplete) => {
                    autocompleteRef.current = autocomplete;
                  }}
                  onPlaceChanged={handlePlaceChanged}
                >
                  <TextField
                    fullWidth
                    margin="normal"
                    name="location"
                    label="Location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Autocomplete>
              )}
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography gutterBottom>Severity: {formData.severity}</Typography>
                <Slider
                  value={formData.severity}
                  onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={0}
                  max={10}
                />
              </Box>
              <DatePicker
                label="Select Date"
                value={formData.date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
              <Button
                variant="contained"
                component="label"
                startIcon={<ImageIcon />}
                fullWidth
                sx={{ mt: 2, mb: 2 }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </Button>
              {formData.image && (
                <Typography variant="body2" gutterBottom>
                  Selected file: {formData.image.name}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={isSubmitting} // Disable button during submission
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </form>
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </Paper>
        </Box>
      </LocalizationProvider>
    </LoadScript>
  );
}
