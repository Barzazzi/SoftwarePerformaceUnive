import React from "react";
import './button.css';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
const  Button=({ onPress }) => {


    return(
    <>
        <button className="compile-button" onClick={onPress}>
            Compile <HiOutlineClipboardCheck/>
        </button>
    </>
    );
}

export default Button;