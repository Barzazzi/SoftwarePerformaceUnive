import React, {useState} from "react";
import axios, { post } from 'axios';
import { FileUploader } from "react-drag-drop-files";
//import {Row, Col} from 'react-bootstrap/';

import { Col, Row } from "../../components"

const MyForm = () => {

  const [file, setFile] = useState(null);

   const onFormSubmit = async (e) => {
    e.preventDefault(); 
    const url = 'http://localhost:3002/file';
    const formData = new FormData();
    formData.append('file',file, file.name);
    const res = await axios.post(url,formData)
    .catch(function (error){
      alert("error: " + JSON.stringify(error));
    });
    alert(JSON.stringify(res.data));
  };

  const onChange = (e) => {
  // da introdurre il controllo
    setFile(e.target.files[0]);
  };
  
  return(
    <>
        <Row>
          <Col>
          <form onSubmit={onFormSubmit}>
              <h1>File Upload</h1>
              <input type="file" onChange={onChange} />
              <button type="submit">Upload</button>
            </form> 
          </Col> 
        </Row>
    </>
  )
}
export default MyForm;
