import React from "react";
import axios, { post } from 'axios';


class MyForm extends React.Component{
    constructor(props) {
        super(props);
        
        this.state ={
          file:null,
          accept_only: ".cpp,.cc"
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    async onFormSubmit (e) {
        e.preventDefault(); // Stop form submit
        //alert("questo è il file" + this.state.file.name);
        const url = 'http://localhost:3002/file';
        const formData = new FormData();
        const file= this.state.file;
        formData.append('file',file, file.name);
        //alert("contenuto di file"+ formData.getAll("file").name);
        const res = await axios.post(url,formData)
        .catch(function (error){
          alert("error: " + JSON.stringify(error));
        });
        alert(JSON.stringify(res.data));
      }

    onChange(e) {
      // da introdurre il controllo
        this.setState({file:e.target.files[0]});
    }


    render() {
        return (
          <form onSubmit={this.onFormSubmit}>
            <h1>File Upload</h1>
            <input type="file" onChange={this.onChange} />
            <button type="submit">Upload</button>
          </form>
       )
    }

}

export default MyForm;
