import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

const CarDiagnosisCreate = ({ onCreateDiagnosis }: { onCreateDiagnosis(s: string): void }) => {
  const [field, setField] = useState('');

  const onClick = () => {
    if (field) {
      onCreateDiagnosis(field);
    }
  };

  return (
    <>
      <h2 className="mt-5">Diagnosis</h2>
      <Row>
        <Col xs={12}>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Describe your issue:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={field}
                onChange={e => setField(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Col>
        <Col className="text-end">
          <Button
            variant="secondary"
            disabled={!field}
            onClick={onClick}
          >
            Create New Diagnosis
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default CarDiagnosisCreate