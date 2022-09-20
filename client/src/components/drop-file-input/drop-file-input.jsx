import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {Button}from '../';

import './drop-file-input.css';

import { ImageConfig } from './ImageConfig'; 
import uploadImg from '../../assets/upload.png';

const DropFileInput = props => {

    const wrapperRef = useRef(null);

    const [file, setFile] = useState(null);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            setFile(newFile);
            //props.onFileChange(file);
        }
    }

    const fileRemove = (file) => {
        setFile(null);
       // props.onFileChange(null);
    }

    return (
        <>
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="drop-file-input__label">
                    <img src={uploadImg} alt="" />
                    <p>Drag and Drop your c++ file here</p>
                </div>
                <input type="file" value="" onChange={onFileDrop}/>
                
            </div>
            {
                file != null ? (
                    <div className="drop-file-preview">
                        <p className="drop-file-preview__title">
                            Ready to upload
                        </p>
                        
                        {
                            <div  className="drop-file-preview__item">
                                <img src={ImageConfig[file.type.split('/')[1]] || ImageConfig['default']} alt="" />
                                <div className="drop-file-preview__item__info">
                                    <p>{file.name}</p>
                                    <p>{file.size}B</p>
                                </div>
                                <span className="drop-file-preview__item__del" onClick={() => fileRemove(file)}>x</span>
                            </div>
                            
                        }
                        <Button/>
                    </div>
                    
                ) : null
            }
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;