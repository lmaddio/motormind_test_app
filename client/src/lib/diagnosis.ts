import * as React from 'react';
import useLocalStorageState from 'use-local-storage-state'
import { Diagnosis } from '../types';

export const createDiagnosis = async (text: string, carId: string) => {
  try {
    const res = await fetch('/api/diagnosis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ issue: text, carId }),
    });
    const data = await res.json();

    if (res.status === 200) {
      return data;
    } else {
      throw new Error(`Failed request: code: ${res.status}, status: ${res.statusText}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export const useGetDiagnosisByCarId = (carId: string) => {
  const [diagnosis, setDiagnosis] = useLocalStorageState<Diagnosis[]>('diagnosis', {
    defaultValue: []
  });
  
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  
  React.useEffect(() => {
    setIsLoading(true);
    const abortController = new AbortController();

    async function getCarDiagnosis() {
      try {
        const res = await fetch(`/api/cars/${carId}/diagnosis`);
        const data = await res.json();

        if (data && data.length >= 0) {
          setDiagnosis(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    getCarDiagnosis();

    return () => {
      abortController.abort();
    };
  }, []);
  
  return { diagnosis, isLoading };
};

export const useGetSingleDiagnosis = ( diagnosisId: string) => {
  const [diagnosis, setDiagnosis] = useLocalStorageState<Diagnosis[]>('diagnosis', {
    defaultValue: []
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setIsLoading(true);
    const abortController = new AbortController();

    async function getDiagnosis() {
      try {
        const res = await fetch(`/api/diagnosis/${diagnosisId}`);
        const data = await res.json();

        if (data && res.status === 200) {
          const diagnosisIndex = diagnosis.findIndex(({ _id }) => _id === diagnosisId);
          if (diagnosisIndex >= 0) {
            const newDiagnosis = [...diagnosis];
            newDiagnosis[diagnosisIndex] = data;

            setDiagnosis(newDiagnosis);
          } else {
            setDiagnosis([...diagnosis, data]);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    getDiagnosis();

    return () => {
      abortController.abort();
    };
  }, []);

  return {
    diagnosis: diagnosis.find(({ _id }) => _id === diagnosisId),
    isLoading
  };
}
