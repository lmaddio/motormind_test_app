import * as React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Car } from '../types';

const validField = (text: string) => Boolean(text);

const CarInput = ({ createCar }: { createCar: (c: Omit<Car, '_id' | 'diagnosis'>) => void }) => {
  const [make, setMake] = React.useState('');
  const [model, setModel] = React.useState('');
  const [year, setYear] = React.useState('');
  const [fuelType, setFuelType] = React.useState('');
  const [motor, setMotor] = React.useState('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createCar({ make, model, year, fuelType, motor });

    setMake('');
    setModel('');
    setYear('');
    setFuelType('');
    setMotor('');
  };

  const buttonDisabled = ![make, model, year, fuelType, motor].every(validField);

  return (
    <Form className='d-none-md mt-3' onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="make">
        <Form.Label>Make</Form.Label>
        <Form.Control
          value={make}
          type="text"
          placeholder="Enter Make"
          onChange={e => setMake(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="model">
        <Form.Label>Model</Form.Label>
        <Form.Control
          value={model}
          type="text"
          placeholder="Enter Model"
          onChange={e => setModel(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="version">
        <Form.Label>Fuel Type</Form.Label>
        <Form.Control
          value={fuelType}
          type="text"
          placeholder="Enter Fuel Type"
          onChange={e => setFuelType(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="motor">
        <Form.Label>Motor</Form.Label>
        <Form.Control
          value={motor}
          type="text"
          placeholder="Enter Motor"
          onChange={e => setMotor(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="year">
        <Form.Label>Year</Form.Label>
        <Form.Control
          value={year}
          type="number"
          placeholder="Enter Year"
          onChange={e => setYear(e.target.value)}
        />
      </Form.Group>

      <Row>
        <Col className="text-end">
          <Button disabled={buttonDisabled} variant="secondary" type="submit">
            Create
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default CarInput;