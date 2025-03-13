import express, { RequestHandler, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getConnectedClient } from './database';
import { createOpenAiRequest } from './openai'

interface Car {
  _id: ObjectId,
  make: string,
  model: string,
  year: string,
  fuelType: string,
  motor: string,
  diagnosis: null | ObjectId[]
}

interface Diagnosis {
  _id: ObjectId,
  carId: string,
  issues: {
    category: string,
    description: string
  }[],
  detail: string,
  date: Date
}


type Params<T> = {} & T;
type ResBody = {};
type ReqBody = {};
type ReqQuery = {};

const getCarsCollection = () => {
  const client = getConnectedClient();
  const collection = client.db('carsdb').collection<Car>('cars');

  return collection;
};

const getDiagnosisCollection = () => {
  const client = getConnectedClient();
  const collection = client.db('carsdb').collection<Diagnosis>('diagnosis');

  return collection;
};

export const router = express.Router();

router.get('/cars', async (req, res: Response) => {
  const collection = getCarsCollection();

  const cars = await collection.find({}).toArray();

  res.status(200).json(cars);
});

const getCarById: RequestHandler<Params<{ id: string }>, ResBody, ReqBody, ReqQuery> = async (req, res) => {
  try {
    const collection = getCarsCollection();

    const _id = new ObjectId(req.params.id);

    if (!_id) {
      res.status(400).json({ msg: 'Id car is required' });
    }

    const car = await collection.findOne({ _id });

    if (!car) {
      res.status(400).json({ msg: 'Car by id not found' });
    } else {
      res.status(200).json(car);
    }
  } catch (error) {
    console.error('error', error);

    res.status(500).json({ msg: 'Error' });
  }
};

router.get('/cars/:id', getCarById);

router.post('/cars', async (req, res) => {
  const collection = getCarsCollection();

  const { car } = req.body;
  
  if (!car) {
    res.status(400).json({ msg: 'Car is required' });

    return;
  }

  const newCar = { ...car, diagnosis: null };

  const newCarDB = await collection.insertOne(newCar);

  res.status(201).json({ ...newCar, _id: newCarDB.insertedId });
});

const deleteCarById: RequestHandler<Params<{ id: string }>, ResBody, ReqBody, ReqQuery> = async (req, res) => {
  const collection = getCarsCollection();

  const _id = new ObjectId(req.params.id);

  if (_id) {
    const deletedCar = await collection.deleteOne({ _id });
    res.status(200).json(deletedCar);

    return;
  }

  res.status(400).json({ msg: 'Id car is required' });
}

router.delete('/cars/:id', deleteCarById);

const getDianosisByCarId: RequestHandler<Params<{ carId: string }>, ResBody, ReqBody, ReqQuery> = async (req, res) => {
  try {
    const collection = getDiagnosisCollection();
    const { carId } = req.params;

    if (carId) {
      const carsDiagnosis = await collection.find({ carId }).toArray();

      res.status(200).json(carsDiagnosis);
      return
    }

    res.status(400).json({ msg: 'Id car is required' });
  } catch (error) {
    console.error('error', error);

    res.status(500).json({ msg: 'Error' });
  }
};

router.get('/cars/:carId/diagnosis', getDianosisByCarId);

const createOpenAiConsult = (diagnosis: string, { make, model, year, fuelType, motor }: Car) =>
  `${diagnosis}, car details are: make: ${make}, model: ${model}, year: ${year}, fuelType: ${fuelType}, motor: ${motor}. Please format the response object with issue (being the cause), category (being the probability which could be one of "high", "medium" or "low", literally those keys only) and description of the issue`;

const JSON_MARK = '```json';
const parseJSON = (text: string) => {
  const startIndex = text.indexOf(JSON_MARK);
  const partial = text.substring(startIndex + JSON_MARK.length);
  const endIndex = partial.indexOf('```');
  const json = partial.substring(0, endIndex);

  return JSON.parse(json);
};

router.post('/diagnosis', async (req, res) => {
  try {
    const diagnosisCollection = getDiagnosisCollection();
    const carCollection = getCarsCollection();

    const { issue, carId } = req.body as { issue: string, carId: string };
    
    if (!carId) {
      res.status(400).json({ msg: 'CarId is required' });

      return;
    } else if (!issue) {
      res.status(400).json({ msg: 'Diagnosis is required' });

      return;
    }
    const _carId = new ObjectId(carId);
    const car = await getCarsCollection().findOne({ _id: _carId });

    if (!car) {
      res.status(400).json({ msg: 'Car not found' });

      return;
    }

    const newDiagnosis = { date: new Date(), detail: issue, issues: [], carId };
    // @ts-ignore
    const newDiagnosisDB = await diagnosisCollection.insertOne(newDiagnosis);

    const updateCarDiagnosis = {
      $set: {
        diagnosis:
          !car.diagnosis
            ? [newDiagnosisDB.insertedId]
            : [...car.diagnosis, newDiagnosisDB.insertedId]
      }
    };

    await carCollection.updateOne({ _id: _carId }, updateCarDiagnosis);

    // Comunicate with OpenAi
    const finalDiagnosis = await createOpenAiRequest(createOpenAiConsult(issue, car));

    if (finalDiagnosis) {
      const diagnosisObject = parseJSON(finalDiagnosis);

      const updateDiagnosis = {
        $set: {
          issues: diagnosisObject,
        }
      };

      await diagnosisCollection.updateOne({ _id: newDiagnosisDB.insertedId }, updateDiagnosis);
      const diagnosisDoc = await diagnosisCollection.findOne({ _id: newDiagnosisDB.insertedId });

      res.status(200).json(diagnosisDoc);
    } else {
      console.warn('Diagnosis is empty');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error' });
  }
});

const getDiagnosisById: RequestHandler<Params<{ id: string }>, ResBody, ReqBody, ReqQuery> = async (req, res) => {
  try {
    const collection = getDiagnosisCollection();

    const _id = new ObjectId(req.params.id);

    if (!_id) {
      res.status(400).json({ msg: 'Id diagnosis is required' });
    }

    const diagnosis = await collection.findOne({ _id });

    if (!diagnosis) {
      res.status(400).json({ msg: 'Diagnosis by id not found' });
    } else {
      res.status(200).json(diagnosis);
    }
  } catch (error) {
    console.error('error', error);

    res.status(500).json({ msg: 'Error' });
  }
};

router.get('/diagnosis/:id', getDiagnosisById);
