import { useRouteError } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './error-page.module.css';
import useLocalStorageState from 'use-local-storage-state';
import { Car, Diagnosis } from '../types';

function ErrorPage() {
  const error = useRouteError() as { statusText: string; message: string };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_cars, setCars] = useLocalStorageState<Car[]>('cars', {
    defaultValue: []
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_diagnosis, setDiagnosis] = useLocalStorageState<Diagnosis[]>('diagnosis', {
    defaultValue: []
  });

  setCars([]);
  setDiagnosis([]);


  return (
    <Container fluid>
      <Row className={`${styles.errorPage} text-center align-items-center`}>
        <Col>
          <div id="error-page">
            <h1 className="pb-5">Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
              <i>{error.statusText || error.message}</i>
            </p>
            <a href="/">Would you like to go back to the home page?</a>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ErrorPage;
