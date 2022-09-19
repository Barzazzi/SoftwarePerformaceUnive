import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import axios, { post } from 'axios';
import "./drag.css"
const fileTypes = ["cpp"];

function DragDrop() {
  const [file, setFile] = useState(null);
  const [result, setResult]=useState("Upload a file to compile it!");
  const handleChange = (file) => {
    setFile(file);
  };
  const submit=async (e)=>{
    e.preventDefault(); // Stop form submit
    //alert("questo è il file" + this.state.file.name);
    const url = 'http://localhost:3002/file';
    const formData = new FormData();
    //const file= this.state.file;
    if(file!=null){
        formData.append('file',file, file.name);
        //alert("contenuto di file"+ formData.getAll("file").name);
        const res = await axios.post(url,formData)
        .catch(function (error){
            alert("error: " + JSON.stringify(error));
        });
        //alert(JSON.stringify(res.data));
        setResult(JSON.stringify(res.data));
        
    }
    
  }
  return (
    <>
        <h1>Compile your c++ file</h1>
        <div className="dropArea">
            <FileUploader handleChange={handleChange} name="file" multiple={false} types={fileTypes} />
            <button onClick={submit}>
                Upload
            </button>
        </div>
        <div className="resultArea">
            {result}
        </div>
        
    </>
    
  );
}

export default DragDrop;