import * as React from 'react';
import useLocalStorageState from 'use-local-storage-state'
import { Car } from '../types';

export const useGetCars = () => {
  const [cars, setCars] = useLocalStorageState<Car[]>('cars', {
    defaultValue: []
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setIsLoading(true);
    const abortController = new AbortController();
    
    async function getCarsData() {
      try {
        const res = await fetch('/api/cars');
        const data = await res.json();

        setCars(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    getCarsData();

    return () => {
      abortController.abort();
    };
  }, []);

  return { cars, isLoading };
};

export const useGetCar = (carId: string) => {
  const [cars, setCars] = useLocalStorageState<Car[]>('cars', {
    defaultValue: []
  });

  const car = cars.find(car => car._id === carId);

  const [isLoading, setIsLoading] = React.useState<boolean>(Boolean(car));

  React.useEffect(() => {
    setIsLoading(true);
    const abortController = new AbortController();

    async function getCarsData() {
      try {
        const res = await fetch(`/api/cars/${carId}`);
        const data = await res.json();

        setCars(cars => ([...cars, data]));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    getCarsData();

    return () => {
      abortController.abort();
    };
  }, []);

  return { car, isLoading };
};

export const useCreateCar = (car: Omit<Car, '_id' | 'diagnosis'>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCars] = useLocalStorageState<Car[]>('cars', {
    defaultValue: []
  });

  fetch('/api/cars', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ car }),
  }).then(res => res.json()).then(res => {
    setCars(c => ([...c, res]));
  }).catch(error => {
    console.error(error);
  });
};
