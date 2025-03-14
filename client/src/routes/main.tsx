import { useNavigate } from 'react-router-dom';
import CarInput from '../components/CarInput';
import CarsTable from '../components/CarsTable';
import { useGetCars } from '../lib/cars';
import { Car } from '../types';
import useLocalStorageState from 'use-local-storage-state';

const App = () => {
  const { cars, isLoading } = useGetCars();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCars] = useLocalStorageState<Car[]>('cars', {
      defaultValue: []
    });
  const navigate = useNavigate();

  const onCarClick = (carId: string) => {
    navigate(`/car/${carId}`);
  };

  const onCreateCar = (car: Omit<Car, '_id' | 'diagnosis'>) => {
    fetch('/api/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ car }),
    }).then(r => r.json().then(r => setCars((cars) => ([...cars, r])))).catch(error => {
      console.error(error);
    });
  }

  return (
    <>
      <h2 className="mt-3">Please load your car to the system</h2>
      <CarInput createCar={onCreateCar} />
      {isLoading && <h2>Loading user cars...</h2>}
      {!isLoading && cars.length === 0 && <h2>No cars found</h2>}
      {!isLoading && cars.length > 0 && <CarsTable cars={cars} onCarClick={onCarClick} />}
    </>
  );
}

export default App;
