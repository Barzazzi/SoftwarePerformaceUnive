import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
const cors = require('cors')
const MyForm= ()=> {
  return (
    <>
      <Form.Group controlId="formFile" className="mb-3" >
        <Form.Label>Default file input example</Form.Label>
        <Form.Control type="file" />
        <Button variant="primary" type="submit" onClick={async ()=>{
            const res=await axios.get('http://localhost:3002/asd');
            alert(JSON.stringify(res));
        }}>
            Submit
        </Button>
      </Form.Group>
    </>
  );
}

export default MyForm;