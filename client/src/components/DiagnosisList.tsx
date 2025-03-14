import Button from 'react-bootstrap/Button';
import { Diagnosis } from '../types';

const DiagnosisList = ({ diagnosis }: { diagnosis: Diagnosis[] }) => (
  <>
    <h2 className="mt-5">Current diagnosis:</h2>
    <ul className='p-0'>
      {
        diagnosis.map((d, index) => {
          const date = new Date(d.date).toLocaleDateString();

          const className = index > 0 ? 'mt-1' : '';

          return (
            
            <li key={index} style={{ 'display': 'block' }}>
              <Button
                variant="secondary"
                className={`${className} p-2 w-100 text-start rounded-0`}
                href={`/diagnosis/${d._id}`}
              >
                {`${date}: ${d.detail}`}
              </Button>
            </li>
          );
        })
      }
    </ul>
  </>
);

export default DiagnosisList;
