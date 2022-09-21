import React from "react";
import './button.css';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
const  Button=({ children, onPress }) => {

    return(
    <>
        <button className="compile-button" onClick={onPress}>
            {children} <HiOutlineClipboardCheck/>
        </button>
    </>
    );
}

export default Button;