import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {Button}from '../';
import axios, { post } from 'axios';
import parse from 'html-react-parser';
import './drop-file-input.css';

import { ImageConfig } from './ImageConfig'; 
import uploadImg from '../../assets/upload.png';

const DropFileInput = props => {

    const wrapperRef = useRef(null);

    const [file, setFile] = useState(null);
    const [result, setResult]=useState(null);

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');

    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        setResult(null);
        const newFile = e.target.files[0];
        if (newFile) {
            setFile(newFile);
        }
    }

    const fileRemove =  async (file) => {
        setFile(null);
    }
    const submit = async (e) => {
        e.preventDefault(); 
        const url = 'http://localhost:3002/file';
        //const url = 'http://169.254.112.156:3002/file';
        const formData = new FormData();
        
        if(file!=null){
            formData.append('file',file, file.name);
            const res = await axios.post(url,formData)
            .catch(function (error){
                alert("error: " + JSON.stringify(error));
            });
            setResult(JSON.stringify(res.data));
            setFile(null);
        }
        
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
                            Selected file:
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
                        <Button onPress={submit}> Compile </Button>
                    </div>
                    
                ) : null
            }
            {
                result != null ? (
                    <div className="drop-file-preview">
                        <div className='drop-file-result'>
                            <pre>{parse(result.replaceAll("\\n"," <br>").replaceAll("\"",""))}</pre>
                        </div>
                    </div>
                ):null 
            }
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}

export default DropFileInput;