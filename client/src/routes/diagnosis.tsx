import { useParams } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Loading from '../components/Loading';
import { useGetSingleDiagnosis } from '../lib/diagnosis'
import { Diagnosis } from '../types';

const DiagnosisDetail = () => {
  const { diagnosisId = '' } = useParams();
  const { diagnosis, isLoading } = useGetSingleDiagnosis(diagnosisId);

  if (!diagnosis && isLoading) {
    return (<Loading />);
  }

  const { issues, detail, date } = diagnosis as Diagnosis;

  return (
    <Container fluid>
      <Card className='mt-4'>
        <Card.Header>
          <Row>
            <Col xs={6}>
              <strong>Car Diagnosis:</strong>
            </Col>
            <Col xs={6} className='text-end'>
              {new Date(date).toLocaleDateString()}
            </Col>
          </Row>
          <Row>
            <Col>
              <Card.Text>
                {detail}
              </Card.Text>
            </Col>
          </Row>
        </Card.Header>
        {
          issues.map(({ category, description, issue }, index) => {
            const categoryLowerCase = category.toLowerCase();
            const isHighProbability = categoryLowerCase.includes('high');
            const isMediumProbability = categoryLowerCase.includes('medium');

            return (
              <ListGroup variant='flush' key={index} className='border-bottom-0'>
                <ListGroup.Item>
                  <Badge
                    style={{ width: '18px' }}
                    bg={isHighProbability ? 'danger' : isMediumProbability ? 'warning' : 'secondary'}
                    pill
                    className='justify-content-center align-content-center text-center d-inline'
                  >
                    {isHighProbability ? 'High' : isMediumProbability ? 'Medium' : 'Low'}
                  </Badge>
                  {' '}{issue}
                </ListGroup.Item>
                <ListGroup.Item><strong>Description:</strong> {description}</ListGroup.Item>
              </ListGroup>
            )
          }
        )
      }
      </Card>
    </Container>
  );
};

export default DiagnosisDetail;
