import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import axios from 'axios';
import UserNavbar from './UserNavbar';
// Define map container style
const containerStyle = {
  width: '100%',
  height: '80vh',
};

const GoogleMapComponent = () => {
  const [issues, setIssues] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  // Fetch issues from the backend
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/issues'); // Fetch all issues
        setIssues(response.data); // Set the issues state with fetched data
      } catch (err) {
        console.error('Error fetching issues:', err);
      }
    };

    fetchIssues();
  }, []);

  // Geocode the location of each issue
  useEffect(() => {
    const geocodeAddresses = async () => {
      const geocodedMarkers = [];

      for (let issue of issues) {
        const location = issue.location; // The location of the report

        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
          );

          if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry.location;
            console.log(`Geocoded location for ${issue.subject}: `, lat, lng); // Add this line to log the coordinates
            geocodedMarkers.push({
              position: { lat, lng },
              title: issue.subject,
            });
          } else {
            console.log('Geocoding failed for: ', location);
          }
        } catch (error) {
          console.error('Error geocoding address:', location, error);
        }
      }

      if (geocodedMarkers.length > 0) {
        setMarkers(geocodedMarkers); // Set the markers for the map
        setMapCenter(geocodedMarkers[0].position); // Dynamically set the map center based on the first marker
      }
    };

    if (issues.length > 0) {
      geocodeAddresses(); // Run geocoding after issues are fetched
    }
  }, [issues]);

  return (
    

    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <UserNavbar/>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={2} // Zoom out to show the world
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position} title={marker.title} />
        ))}
      </GoogleMap>
    </LoadScript>
        
  );
};

export default GoogleMapComponent;
