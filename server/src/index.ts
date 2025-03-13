import dotenv from 'dotenv';
import express from 'express';
import { router } from './routes';
import { connectToMongoDB } from './database';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '../build')));
app.get('/', (req, res) => {
  console.log('get homepage', path.join(__dirname, '../build/index.html'));

  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.use('/api', router);

const port = process.env.PORT || 5000;

async function startServer() {
  await connectToMongoDB();

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();