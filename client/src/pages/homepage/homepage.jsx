import React from 'react';
import {MyForm}from '../../components/';
import {Drag}from '../../components/';
import {Drop}from '../../components/';
import {Button}from '../../components/';
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