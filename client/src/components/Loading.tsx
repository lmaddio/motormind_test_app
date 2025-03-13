import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Loading = () => (
  <Container fluid>
    <Row className='text-center align-items-center' style={{ height: '100vh' }}>
      <Col><Spinner animation='border'/></Col>
    </Row>
  </Container>
);

export default Loading;
