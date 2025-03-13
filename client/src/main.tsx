// import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './routes/error-page';
import Car from './routes/car';
import Diagnosis from './routes/diagnosis';
import Main from './routes/main';
import Layout from './Layout';

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Main />,
        errorElement: <ErrorPage />,
      }, {
        path: "car/:carId",
        element: <Car />,
        errorElement: <ErrorPage />,
      }, {
        path: "diagnosis/:diagnosisId",
        element: <Diagnosis />,
        errorElement: <ErrorPage />,
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
