"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const database_1 = require("./database");
const openai_1 = require("./openai");
const getCarsCollection = () => {
    const client = (0, database_1.getConnectedClient)();
    const collection = client.db('carsdb').collection('cars');
    return collection;
};
const getDiagnosisCollection = () => {
    const client = (0, database_1.getConnectedClient)();
    const collection = client.db('carsdb').collection('diagnosis');
    return collection;
};
exports.router = express_1.default.Router();
exports.router.get('/cars', async (req, res) => {
    const collection = getCarsCollection();
    const cars = await collection.find({}).toArray();
    res.status(200).json(cars);
});
const getCarById = async (req, res) => {
    try {
        const collection = getCarsCollection();
        const _id = new mongodb_1.ObjectId(req.params.id);
        if (!_id) {
            res.status(400).json({ msg: 'Id car is required' });
        }
        const car = await collection.findOne({ _id });
        if (!car) {
            res.status(400).json({ msg: 'Car by id not found' });
        }
        else {
            res.status(200).json(car);
        }
    }
    catch (error) {
        console.error('error', error);
        res.status(500).json({ msg: 'Error' });
    }
};
exports.router.get('/cars/:id', getCarById);
exports.router.post('/cars', async (req, res) => {
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
const deleteCarById = async (req, res) => {
    const collection = getCarsCollection();
    const _id = new mongodb_1.ObjectId(req.params.id);
    if (_id) {
        const deletedCar = await collection.deleteOne({ _id });
        res.status(200).json(deletedCar);
        return;
    }
    res.status(400).json({ msg: 'Id car is required' });
};
exports.router.delete('/cars/:id', deleteCarById);
const getDianosisByCarId = async (req, res) => {
    try {
        const collection = getDiagnosisCollection();
        const { carId } = req.params;
        if (carId) {
            const carsDiagnosis = await collection.find({ carId }).toArray();
            res.status(200).json(carsDiagnosis);
            return;
        }
        res.status(400).json({ msg: 'Id car is required' });
    }
    catch (error) {
        console.error('error', error);
        res.status(500).json({ msg: 'Error' });
    }
};
exports.router.get('/cars/:carId/diagnosis', getDianosisByCarId);
const createOpenAiConsult = (diagnosis, { make, model, year, fuelType, motor }) => `${diagnosis}, car details are: make: ${make}, model: ${model}, year: ${year}, fuelType: ${fuelType}, motor: ${motor}. Please format the response object with issue (being the cause), category (being the probability which could be one of "high", "medium" or "low", literally those keys only) and description of the issue`;
const JSON_MARK = '```json';
const parseJSON = (text) => {
    const startIndex = text.indexOf(JSON_MARK);
    const partial = text.substring(startIndex + JSON_MARK.length);
    const endIndex = partial.indexOf('```');
    const json = partial.substring(0, endIndex);
    return JSON.parse(json);
};
exports.router.post('/diagnosis', async (req, res) => {
    try {
        const diagnosisCollection = getDiagnosisCollection();
        const carCollection = getCarsCollection();
        const { issue, carId } = req.body;
        if (!carId) {
            res.status(400).json({ msg: 'CarId is required' });
            return;
        }
        else if (!issue) {
            res.status(400).json({ msg: 'Diagnosis is required' });
            return;
        }
        const _carId = new mongodb_1.ObjectId(carId);
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
                diagnosis: !car.diagnosis
                    ? [newDiagnosisDB.insertedId]
                    : [...car.diagnosis, newDiagnosisDB.insertedId]
            }
        };
        await carCollection.updateOne({ _id: _carId }, updateCarDiagnosis);
        // Comunicate with OpenAi
        const finalDiagnosis = await (0, openai_1.createOpenAiRequest)(createOpenAiConsult(issue, car));
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
        }
        else {
            console.warn('Diagnosis is empty');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error' });
    }
});
const getDiagnosisById = async (req, res) => {
    try {
        const collection = getDiagnosisCollection();
        const _id = new mongodb_1.ObjectId(req.params.id);
        if (!_id) {
            res.status(400).json({ msg: 'Id diagnosis is required' });
        }
        const diagnosis = await collection.findOne({ _id });
        if (!diagnosis) {
            res.status(400).json({ msg: 'Diagnosis by id not found' });
        }
        else {
            res.status(200).json(diagnosis);
        }
    }
    catch (error) {
        console.error('error', error);
        res.status(500).json({ msg: 'Error' });
    }
};
exports.router.get('/diagnosis/:id', getDiagnosisById);
