import React from 'react';
import {Drop}from '../../components/';
import './homepage.css';
const Homepage = () => {
    return( 
        <div className="box">
            <h2 className="header">
                React drop files input
            </h2>
            <Drop
            />
        </div>
    );
}

export default Homepage;