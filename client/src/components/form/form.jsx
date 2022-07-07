import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const MyForm= ()=> {
  return (
    <>
      <Form action="http://localhost:3002/file" enctype="multipart/form-data" method="post" >
        <Form.Group controlId="formFile" className="mb-3" >
          <Form.Label>Default file input example</Form.Label>
          <Form.Control type="file" name="uploaded_file"/>
          <Button variant="primary" type="submit" >
              Submit
          </Button>
        </Form.Group>
      </Form>
      
    </>
  );
}

export default MyForm;

