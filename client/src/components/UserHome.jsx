import React, { useState } from "react";
import './home.css';
import UserNavbar from "./UserNavbar";
import ReportIssueForm from "./ReportIssueForm";
import GoogleMap from "./GoogleMap";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Slider } from '@mui/material';


const UserHome = () => {
   
   

    return (
        <div className="wrap">
            <UserNavbar/>

        
        
      
            <p className="">Welcome, User!</p>
        </div>
        
    );
  }
  
  export default UserHome;