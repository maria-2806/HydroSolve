import React, { useState, useEffect } from "react";
import './home.css';
import UserNavbar from "./UserNavbar";
import ReportIssueForm from "./ReportIssueForm";
import GoogleMap from "./GoogleMap";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Slider } from '@mui/material';
import UncontrolledExample from "./Testimonials";

const UserHome = () => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Retrieve the user's name from localStorage
        const name = localStorage.getItem('name');
        setUserName(name || 'User'); // Fallback to 'User' if no name is found
    }, []);

    return (
        <div className="wrap">
            <UserNavbar/>
            <h1 className="text-center my-5">Welcome, {userName}!</h1>
            <UncontrolledExample/>
        </div>
    );
}

export default UserHome;
