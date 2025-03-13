import Table from 'react-bootstrap/Table';
import { Car } from '../types';
import styles from './CarsTable.module.css';

interface ICartTableProps {
  cars: Car[];
  onCarClick?: (carId: string) => void;
}

const CarRow = ({ car, onClick }: { car: Car, onClick?: (id: string) => void }) => {
  const onClickRow = () => {
    onClick?.(car._id);
  };

  const carRowStyles = onClick ? styles.carRowClickable : '';

  return (
    <tr key={car._id} className={`${carRowStyles}`} id={car._id} onClick={onClickRow}>
      <td>{car.make}</td>
      <td>{car.model}</td>
      <td>{car.year}</td>
      <td>{car.motor}</td>
      <td>{car.fuelType}</td>
    </tr>
  );
};

const CarsTable = ({ cars, onCarClick }: ICartTableProps) => (
  <Table striped bordered hover={Boolean(onCarClick)} className={`${styles.carTable} mt-3`}>
    <thead>
      <tr>
        <th>Make</th>
        <th>Model</th>
        <th>Year</th>
        <th>Motor</th>
        <th>Fuel Type</th>
      </tr>
    </thead>
    <tbody>
      {cars.map((car) => (
        <CarRow key={car._id} car={car} onClick={onCarClick} />
      ))}
    </tbody>
  </Table>
);

export default CarsTable;