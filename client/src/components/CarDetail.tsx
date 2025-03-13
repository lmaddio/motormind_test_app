import { Car } from "../types";
import CarsTable from "./CarsTable";

const CarDetail = ({ car }: { car: Car }) => (
  <>
    <h2>Your car</h2>
    <CarsTable cars={[car]} />
  </>
)

export default CarDetail;
