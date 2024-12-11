import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import assetRoutes from './routes/assetsRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/assets', assetRoutes);
app.use('/api/v1/requests', requestRoutes);

app.get('/', async (req, res) => {
    res.status(200).json({
      message: 'Test Server',
    });
});

const startServer = async () => {
    try {
      await connectDB(process.env.MONGODB_URL); 
      app.listen(8080, () => console.log('Server started on port 8080'));
    } catch (error) {
      console.log(error);
    }
};

startServer();
