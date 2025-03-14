import dotenv from 'dotenv';
import express from 'express';
import { router } from './routes';
import { connectToMongoDB } from './database';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

try {
  app.use(express.static(path.join(__dirname, '../build')));
} catch (error) {
  
}
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});
app.get('/car/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});
app.get('/diagnosis/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.use('/api', router);

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectToMongoDB();

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();