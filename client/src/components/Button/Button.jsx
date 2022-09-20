import React from "react";
import './button.css';

const Button = ({operation})=>{

    
    return(
   <button className="myButton" onClick={operation}>
    <p>Upload my file</p>
    </button>
    );
}

export default Button;