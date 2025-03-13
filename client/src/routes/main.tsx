import { useNavigate } from 'react-router-dom';
import CarInput from '../components/CarInput';
import CarsTable from '../components/CarsTable';
import { useGetCars, useCreateCar } from '../lib/cars';

const App = () => {
  const { cars, isLoading } = useGetCars();
  const navigate = useNavigate();

  const onCarClick = (carId: string) => {
    navigate(`/car/${carId}`);
  };

  return (
    <>
      <h2 className="mt-3">Please load your car to the system</h2>
      <CarInput createCar={useCreateCar} />
      {isLoading && <h2>Loading user cars...</h2>}
      {!isLoading && cars.length === 0 && <h2>No cars found</h2>}
      {!isLoading && cars.length > 0 && <CarsTable cars={cars} onCarClick={onCarClick} />}
    </>
  );
}

export default App;
