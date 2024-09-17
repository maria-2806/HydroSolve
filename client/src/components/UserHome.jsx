import React, { useState, useEffect } from "react";
import './home.css';
import UserNavbar from "./UserNavbar";
import ReportIssueForm from "./ReportIssueForm";
import GoogleMap from "./GoogleMap";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Slider } from '@mui/material';

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
            <p className="">Welcome, {userName}!</p>
        </div>
    );
}

export default UserHome;
