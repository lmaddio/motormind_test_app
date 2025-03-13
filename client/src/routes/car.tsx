import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';

import useLocalStorageState from 'use-local-storage-state';

import { useGetCar } from '../lib/cars';
import { createDiagnosis, useGetDiagnosisByCarId } from '../lib/diagnosis';
import CarDetail from '../components/CarDetail';
import CarDiagnosisCreate from '../components/CarDiagnosisCreate';
import { Diagnosis } from '../types';
import DiagnosisList from '../components/DiagnosisList';
import Loading from '../components/Loading';

const Car = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setDiagnosis] = useLocalStorageState<Diagnosis[]>('diagnosis', {
    defaultValue: []
  });
  const [isLoadingDiagnosis, setIsLoadingDiagnosis] = useState(false);

  const { carId = '' } = useParams();
  const { car, isLoading } = useGetCar(carId);
  const navigate = useNavigate();
  const { diagnosis, isLoading: diagnosisIsLoading } = useGetDiagnosisByCarId(carId);

  const onCreateDiagnosis = async (text: string) => {
    setIsLoadingDiagnosis(true);
    const diag = await createDiagnosis(text, carId);

    setIsLoadingDiagnosis(false);
    setDiagnosis(s => ([...s, diag]));
    navigate(`/diagnosis/${diag._id}`);
  };

  if (isLoadingDiagnosis) {
    return (<Loading />);
  }

  return (
    <Container className="mt-3">
      {
        isLoading
          ? <h2>Loading car details...</h2>
          : car && (<CarDetail car={car}/>)
      }
      <CarDiagnosisCreate onCreateDiagnosis={onCreateDiagnosis} />
      {
        diagnosisIsLoading
          ? <h2 className="mt-3">Loading car diagnosis...</h2>
          : (!diagnosis || diagnosis.length === 0) && <h2 className="mt-3">No car diagnosis found.</h2>
      }
      {
        diagnosis && diagnosis.length > 0 && (<DiagnosisList diagnosis={diagnosis}/>)
      }
    </Container>
  );
};

export default Car;
